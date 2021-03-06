
# `nikita.system.mkdir(options, [callback])`

Recursively create a directory. The behavior is similar to the Unix command
`mkdir -p`. It supports an alternative syntax where options is simply the path
of the directory to create.

## Options

*   `cwd`   
    Current working directory for relative paths.   
*   `uid`   
    Unix user id.   
*   `gid`   
    Unix group id.   
*   `mode`   
    Default to "0755".   
*   `directory`   
    Path or array of paths.   
*   `target`   
    Alias for `directory`.   
*   `exclude`   
    Regular expression.   
*   `parent` (boolean|object)   
    Create parent directory with provided options if an object or default 
    system options if "true".   
*   `source`   
    Alias for `directory`.   

## Callback Parameters

*   `err`   
    Error object if any.   
*   `status`   
    Value is "true" if directory was created or modified.   

## Simple usage

```js
require('nikita').system.mkdir('./some/dir', function(err, status){
  console.log(err ? err.message : "Directory created: " + status);
});
```

## Advanced usage

```js
require('nikita').system.mkdir({
  ssh: ssh,
  target: './some/dir',
  uid: 'a_user',
  gid: 'a_group'
  mode: 0o0777 // or '777'
}, function(err, status){
  console.log(err ? err.message : 'Directory created: ' + status);
});
```

## Source Code

    module.exports = (options, callback) ->
      options.log message: "Entering mkdir", level: 'DEBUG', module: 'nikita/lib/system/mkdir'
      modified = false
      # Validate parameters
      # options = { directory: options } if typeof options is 'string'
      options.target = options.argument if options.argument?
      options.directory ?= options.target
      options.directory ?= options.source
      return callback new Error 'Missing directory option' unless options.directory?
      options.cwd = process.cwd() if not options.ssh and (options.cwd is true or not options.cwd)
      options.directory = [options.directory] unless Array.isArray options.directory
      options.parent = {} if options.parent is true
      each options.directory
      .call (directory, callback) =>
        # first, we need to find which directory need to be created
        # options.log message: "Creating directory '#{directory}'", level: 'DEBUG', module: 'nikita/lib/system/mkdir'
        do_stats = ->
          end = false
          dirs = []
          p = if options.ssh then path.posix else path
          directory = if options.cwd then p.resolve options.cwd, directory else p.normalize directory # path.resolve also normalize
          # Create directory and its parent directories
          directories = directory.split('/')
          directories.shift() # first element is empty with absolute path
          directories.pop() if directories[directories.length-1] is ''
          directories = for i in [0...directories.length]
            '/' + directories.slice(0, directories.length - i).join '/'
          each(directories)
          .call (directory, i, next) ->
            return next() if end
            options.log message: "Stat '#{directory}'", level: 'DEBUG', module: 'nikita/lib/system/mkdir'
            fs.stat options.ssh, directory, (err, stat) ->
              if err?.code is 'ENOENT' # if the directory is not yet created
                directory.stat = stat
                dirs.push directory
                if i is directories.length - 1
                then return do_create_parent(dirs)
                else return next()
              if stat?.isDirectory()
                end = true
                return  if i is 0 then do_update(stat) else do_create_parent(dirs)
              if err
                return next err
              else # a file or symlink exists at this location
                return next new Error "Not a directory: #{JSON.stringify directory}"
          .then callback
        do_create_parent = (directories) ->
          return do_create directories unless options.uid or options.guid
          uid_gid options, (err) ->
            return next err if err
            do_create directories
        do_create = (directories) ->
          each(directories.reverse())
          .call (directory, i, callback) ->
            # Directory name contains variables
            # eg /\${/ on './var/cache/${user}' creates './var/cache/'
            if options.exclude? and options.exclude instanceof RegExp
              return callback() if options.exclude.test path.basename directory
            options.log message: "Create directory \"#{directory}\"", level: 'DEBUG', module: 'nikita/lib/system/mkdir' # unless directory is options.directory
            attrs = ['mode', 'uid', 'gid', 'size', 'atime', 'mtime']
            opts = {}
            for attr in attrs
              val = if i is directories.length - 1 then options[attr] else options.parent?[attr]
              opts[attr] = val if val?
            fs.mkdir options.ssh, directory, opts, (err) ->
              return callback err if err
              options.log message: "Directory \"#{directory}\" created ", level: 'INFO', module: 'nikita/lib/system/mkdir'
              modified = true
              callback()
            , 1000
          .then (err) ->
            return callback err if err
            callback()
        do_update = (stat) =>
          options.log message: "Directory already exists", level: 'INFO', module: 'nikita/lib/system/mkdir'
          @system.chown
            target: directory
            stat: stat
            uid: options.uid
            gid: options.gid
            if: options.uid? or options.gid?
          @system.chmod
            target: directory
            stat: stat
            mode: options.mode
            if: options.mode?
          @then (err, moded) ->
            return callback err if err
            modified = true if moded
            callback()
        do_stats()
      .then (err) ->
        callback err, modified

## Dependencies

    fs = require 'ssh2-fs'
    path = require 'path'
    each = require 'each'
    misc = require '../misc'
    wrap = require '../misc/wrap'
    uid_gid = require '../misc/uid_gid'
