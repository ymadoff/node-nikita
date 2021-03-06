
`nikita.file.types.yum_repo`

Yum is a packet manager for centos/redhat. It uses .repo file located in /etc/yum.repos.d/
directory to configure the list of available mirrors.

## Options

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
*   `target`   
    Can be absolute or relative to '/etc/yum.repos.d'
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
      options.log message: "Entering file.types.yum_repo", level: 'DEBUG', module: 'nikita/lib/file/types/yum_repo'
      # set option.target to yum's default path if source and not target
      options.target = "#{path.resolve '/etc/yum.repos.d', options.target}" if options.target?
      throw Error 'Missing target' unless options.target?
      # set target to yum's default path if target is not absolute path
      @file.ini
        stringify: misc.ini.stringify
        parse: misc.ini.parse_multi_brackets
        escape: false
      , options

## Dependencies

    path = require 'path'
    misc = require '../../misc'
