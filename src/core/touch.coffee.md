
# `touch(options, callback)`

Create a empty file if it does not yet exists.

## Implementation details

Internally, it delegates most of the work to the `mecano.write` module. It isn't
yet a real `touch` implementation since it doesnt change the file time if it
exists.

## Options

*   `destination`   
    File path where to write content to.   
*   `gid`   
    File group name or group id.   
*   `uid`   
    File user name or user id.   
*   `mode`   
    File mode (permission and sticky bits), default to `0666`, in the form of
    `{mode: 0o0744}` or `{mode: "0744"}`.   


## Example

```js
require('mecano').touch({
  ssh: ssh,
  destination: '/tmp/a_file'
}, function(err, touched){
  console.log(err ? err.message : 'File touched: ' + !!touched);
});
```

## Source Code

    module.exports = (options, callback) ->
      # Validate parameters
      options.destination = options.argument if options.argument?
      return callback new Error "Missing destination: #{options.destination}" unless options.destination
      options.log message: "Check if destination exists \"#{options.destination}\"", level: 'DEBUG', module: 'mecano/src/touch'
      fs.exists options.ssh, options.destination, (err, exists) =>
        return callback err if err
        return callback() if exists
        options.log message: "Destination does not exists", level: 'INFO', module: 'mecano/src/touch'
        @write
          content: ''
          destination: options.destination
        @then callback

## Dependencies

    fs = require 'ssh2-fs'