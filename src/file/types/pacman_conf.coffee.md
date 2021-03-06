
`nikita.file.types.pacman_conf`

pacman is a package manager utility for Arch Linux. The file is usually located 
in "/etc/pacman.conf".

## Options

*   `rootdir` (string)   
    Path to the mount point corresponding to the root directory, optional.   
*   `backup`   
    Create a backup, append a provided string to the filename extension or a
    timestamp if value is not a string.   
*   `clean`   
    Remove all the lines whithout a key and a value, default to "true".   
*   `content`   
    Object to stringify.   
*   `merge`   
    Read the target if it exists and merge its content.   
*   `parse`   
    User-defined function to parse the content from ini format, default to
    `require('ini').parse`, see 'misc.ini.parse_multi_brackets'.   
*   `separator`   
    Default separator between keys and values, default to " : ".   
*   `stringify`   
    User-defined function to stringify the content to ini format, default to
    `require('ini').stringify`, see 'misc.ini.stringify_square_then_curly' for
    an example.   
*   `target` (string)   
    File to write, default to "/etc/pacman.conf".   

## Source Code

    module.exports = (options) ->
      options.log message: "Entering file.types.pacman_conf", level: 'DEBUG', module: 'nikita/lib/file/types/pacman_conf'
      options.target ?= '/etc/pacman.conf'
      options.target = "#{path.join options.rootdir, options.target}" if options.rootdir
      @file.ini
        stringify: misc.ini.stringify_single_key
      , options

## Dependencies

    path = require 'path'
    misc = require '../../misc'
