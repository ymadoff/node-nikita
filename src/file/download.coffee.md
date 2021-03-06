
# `nikita.file.download(options, [callback])`

Download files using various protocols.

In local mode (with an SSH connection), the `http` protocol is handled with the
"request" module when executed locally, the `ftp` protocol is handled with the
"jsftp" and the `file` protocol is handle with the native `fs` module.

The behavior of download may be confusing wether you are running over SSH or
not. It's philosophy mostly rely on the target point of view. When download
run, the target is local, compared to the upload function where target
is remote.

A checksum may provided with the option "sha256", "sha1" or "md5" to validate the uploaded
file signature.

Caching is active if "cache_dir" or "cache_file" are defined to anything but false.
If cache_dir is not a string, default value is './'
If cache_file is not a string, default is source basename.

Nikita resolve the path from "cache_dir" to "cache_file", so if cache_file is an
absolute path, "cache_dir" will be ignored

If no cache is used, signature validation is only active if a checksum is
provided.

If cache is used, signature validation is always active, and md5sum is automatically
calculated if neither sha256, sh1 nor md5 is provided.

## Options

*   `cache` (boolean)
    Activate the cache, default to true if either "cache_dir" or "cache_file" is
    activated.   
*   `cache_dir` (path)   
    If local_cache is not a string, the cache file path is resolved from cache
    dir and cache file.
    By default: './'   
*   `cache_file` (string | boolean)   
    Cache the file on the executing machine, equivalent to cache unless an ssh
    connection is provided. If a string is provided, it will be the cache path.   
    By default: basename of source   
*   `force` (boolean)   
    Overwrite target file if it exists.   
*   `force_cache` (boolean)   
    Force cache overwrite if it exists   
*   `gid`   
    Group name or id who owns the target file.   
*   `headers` (array)   
    Extra  header  to include in the request when sending HTTP to a server.   
*   `location` (boolean)   
    If the server reports that the requested page has moved to a different
    location (indicated with a Location: header and a 3XX response code), this
    option will make curl redo the request on the new place.   
*   `md5` (MD5 Hash)   
    Hash of the file using MD5. Used to check integrity
*   `mode` (octal mode)   
    Permissions of the target. If specified, nikita will chmod after download   
*   `proxy` (string)   
    Use the specified HTTP proxy. If the port number is not specified, it is
    assumed at port 1080. See curl(1) man page.   
*   `sha1` (SHA-1 Hash)   
    Hash of the file using SHA-1. Used to check integrity.   
*   `sha256` (SHA-256 Hash)   
    Hash of the file using SHA-256. Used to check integrity.   
*   `source` (path)   
    File, HTTP URL, FTP, GIT repository. File is the default protocol if source
    is provided without any.   
*   `target` (path)   
    Path where the file is downloaded.   
*   `uid`   
    User name or id who owns the target file.   

## Callback parameters

*   `err`
    Error object if any.
*   `downloaded`
    Value is "true" if file was downloaded.

## File example

```js
require('nikita').download({
  source: 'file://path/to/something',
  target: 'node-sigar.tgz'
}, function(err, downloaded){
  console.log(err ? err.message : 'File was downloaded: ' + downloaded);
});
```

## HTTP example

```coffee
nikita.download
  source: 'https://github.com/wdavidw/node-nikita/tarball/v0.0.1'
  target: 'node-sigar.tgz'
, (err, downloaded) -> ...
```

## FTP example

```coffee
nikita.download
  source: 'ftp://myhost.com:3334/wdavidw/node-nikita/tarball/v0.0.1'
  target: 'node-sigar.tgz'
  user: 'johndoe',
  pass: '12345'
, (err, downloaded) -> ...
```

## Source Code

    module.exports = (options) ->
      options.log message: "Entering file.download", level: 'DEBUG', module: 'nikita/lib/file/download'
      throw Error "Missing source: #{options.source}" unless options.source
      throw Error "Missing target: #{options.target}" unless options.target
      options.source = options.source.substr 7 if /^file:\/\//.test options.source
      stageDestination = null
      if options.md5?
        throw Error "Invalid MD5 Hash:#{options.md5}" unless typeof options.md5 in ['string', 'boolean']
        algo = 'md5'
        source_hash = options.md5
      else if options.sha1?
        throw Error "Invalid SHA-1 Hash:#{options.sha1}" unless typeof options.sha1 in ['string', 'boolean']
        algo = 'sha1'
        source_hash = options.sha1
      else if options.sha256?
        throw Error "Invalid SHA-256 Hash:#{options.sha256}" unless typeof options.sha256 in ['string', 'boolean']
        algo = 'sha256'
        source_hash = options.sha256
      else
        algo = 'md5'
      protocols_http = ['http:', 'https:']
      protocols_ftp = ['ftp:', 'ftps:']
      # hash_info = null
      options.log message: "Using force: #{JSON.stringify options.force}", level: 'DEBUG', module: 'nikita/lib/file/download'
      source_url = url.parse options.source
      # Disable caching if source is a local file and cache isnt exlicitly set by user
      options.cache = false if not options.cache? and source_url.protocol is null
      options.cache ?= !!(options.cache_dir or options.cache_file)
      @call # Accelarator in case we know the target signature
        if: typeof source_hash is 'string'
        shy: true
        handler: (_, callback) ->
          options.log message: "Shortcircuit check if provided hash match target", level: 'WARN', module: 'nikita/lib/file/download'
          file.hash options.ssh, options.target, algo, (err, hash) =>
            err = null if err?.code is 'ENOENT'
            callback err, source_hash is hash
        , (err, end) ->
          return unless end
          options.log message: "Destination with valid signature, download aborted", level: 'INFO', module: 'nikita/lib/file/download'
          @end()
      @file.cache # Download the file and place it inside local cache
        if: options.cache
        ssh: null
        source: options.source
        cache_dir: options.cache_dir
        cache_file: options.cache_file
        headers: options.headers
        md5: options.md5
        proxy: options.proxy
        location: options.location
      , (err, cached, file) ->
        throw err if err
        options.source = file if options.cache
        source_url = url.parse options.source
      @call (_, callback) ->
        ssh2fs.stat @options.ssh, options.target, (err, stat) ->
          return callback err if err and err.code isnt 'ENOENT'
          if stat?.isDirectory()
            options.log message: "Destination is a directory", level: 'DEBUG', module: 'nikita/lib/file/download'
            options.target = path.join options.target, path.basename options.source
          stageDestination = "#{options.target}.#{Date.now()}#{Math.round(Math.random()*1000)}"
          callback()
      @call
        if: -> source_url.protocol in protocols_http
        handler: ->
          options.log message: "HTTP Download", level: 'DEBUG', module: 'nikita/lib/file/download'
          fail = if options.fail then "--fail" else ''
          k = if source_url.protocol is 'https:' then '-k' else ''
          cmd = "curl #{fail} #{k} -s #{options.source} -o #{stageDestination}"
          cmd += " -x #{options.proxy}" if options.proxy
          options.log message: "Download file from url using curl", level: 'INFO', module: 'nikita/lib/file/download'
          @system.mkdir
            shy: true
            target: path.dirname stageDestination
          @system.execute
            cmd: cmd
            shy: true
          @call
            if: typeof source_hash is 'string'
            handler: (_, callback) ->
              file.hash options.ssh, stageDestination, algo, (err, hash) =>
                return callback Error "Invalid downloaded checksum, found '#{hash}' instead of '#{source_hash}'" if source_hash isnt hash
                callback()
          @call (_, callback) ->
            file.compare_hash (if options.cache then null else options.ssh), stageDestination, options.ssh, options.target, algo, (err, match, hash1, hash2) ->
              options.log message: "Hash dont match, source is '#{hash1}' and target is '#{hash2}'", level: 'WARN', module: 'nikita/lib/file/download' unless match
              options.log message: "Hash matches as '#{hash1}'", level: 'INFO', module: 'nikita/lib/file/download' if match
              callback err, not match
          @system.remove
            unless: -> @status -1
            shy: true
            target: stageDestination
      @call
        if: -> source_url.protocol not in protocols_http and not options.ssh
        handler: ->
          options.log message: "File Download without ssh (with or without cache)", level: 'DEBUG', module: 'nikita/lib/file/download'
          @call (_, callback) ->
            file.compare_hash null, options.source, null, options.target, algo, (err, match, hash1, hash2) ->
              options.log message: "Hash dont match, source is '#{hash1}' and target is '#{hash2}'", level: 'WARN', module: 'nikita/lib/file/download' unless match
              options.log message: "Hash matches as '#{hash1}'", level: 'INFO', module: 'nikita/lib/file/download' if match
              callback err, not match
          @system.mkdir
            if: -> @status -1
            shy: true
            target: path.dirname stageDestination
          @call
            if: -> @status -2
            handler: (_, callback) ->
              rs = fs.createReadStream options.source
              rs.on 'error', (err) ->
                options.log  message: "No such source file: #{options.source} (ssh is #{JSON.stringify !!options.ssh})", level: 'ERROR', module: 'nikita/lib/file/download'
                err.message = 'No such source file'
                callback err
              ws = fs.createWriteStream stageDestination
              rs.pipe(ws)
              .on 'close', callback
              .on 'error', callback
      @call
        if: -> source_url.protocol not in protocols_http and options.ssh
        handler: ->
          options.log message: "File Download with ssh (with or without cache)", level: 'DEBUG', module: 'nikita/lib/file/download'
          @call (_, callback) ->
            file.compare_hash null, options.source, options.ssh, options.target, algo, (err, match, hash1, hash2) ->
              options.log message: "Hash dont match, source is '#{hash1}' and target is '#{hash2}'", level: 'WARN', module: 'nikita/lib/file/download' unless match
              options.log message: "Hash matches as '#{hash1}'", level: 'INFO', module: 'nikita/lib/file/download' if match
              callback err, not match
          @system.mkdir
            if: -> @status -1
            shy: true
            target: path.dirname stageDestination
          @call
            if: -> @status -2
            handler: (_, callback) ->
              options.log message: "Local source: '#{options.source}'", level: 'INFO', module: 'nikita/lib/file/download'
              options.log message: "Remote target: '#{stageDestination}'", level: 'INFO', module: 'nikita/lib/file/download'
              rs = fs.createReadStream options.source
              rs.on 'error', (err) ->
                console.log 'rs on error', err
              ssh2fs.writeFile options.ssh, stageDestination, rs, (err) ->
                options.log "Upload failed from local to remote" if err
                callback err
      @call ->
        options.log message: "Unstage downloaded file", level: 'DEBUG', module: 'nikita/lib/file/download'
        @system.move
          if: @status()
          source: stageDestination
          target: options.target
        @system.chmod
          target: options.target
          mode: options.mode
          if: options.mode?
        @system.chown
          target: options.target
          uid: options.uid
          gid: options.gid
          if: options.uid? or options.gid?

## Module Dependencies

    fs = require 'fs'
    ssh2fs = require 'ssh2-fs'
    path = require 'path'
    url = require 'url'
    curl = require '../misc/curl'
    file = require '../misc/file'
