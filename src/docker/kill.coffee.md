
# `docker_kill(options, callback)`

Send signal to containers using SIGKILL or a specified signal.
Note if container is not running , SIGKILL is not executed and
return status is UNMODIFIED. If container does not exist nor is running
SIGNAL is not sent.

## Options

*   `container` (string)
    Name/ID of the container. MANDATORY
*   `machine` (string)
    Name of the docker-machine. MANDATORY if using docker-machine
*   `signal` (int|string)
    Use a specified signal. SIGKILL by default
*   `code` (int|array)
    Expected code(s) returned by the command, int or array of int, default to 0.
*   `code_skipped`
    Expected code(s) returned by the command if it has no effect, executed will
    not be incremented, int or array of int.
*   `log`
    Function called with a log related messages.
*   `ssh` (object|ssh2)
    Run the action on a remote server using SSH, an ssh2 instance or an
    configuration object used to initialize the SSH connection.
*   `stdout` (stream.Writable)
    Writable EventEmitter in which the standard output of executed commands will
    be piped.
*   `stderr` (stream.Writable)
    Writable EventEmitter in which the standard error output of executed command
    will be piped.

## Callback parameters

*   `err`
    Error object if any.
*   `executed`
    if command was executed

## Example

```javascript
mecano.docker_kill({
  container: 'toto'
  signal: 9
}, function(err, is_true){
  if(err){
    console.log(err.message);
  }else if(is_true){
    console.log('OK!');
  }else{
    console.log('Ooops!');
  }
})
```

## Source Code

    module.exports = (options, callback) ->
      # Validate parameters
      return callback Error 'Missing container parameter' unless options.container?
      cmd = ' kill '
      cmd += "-s #{options.signal} " if options.signal?
      cmd += options.container
      docker.exec " ps | grep '#{options.container}' | grep 'Up'", options, true, (err, executed, out, er) ->
        return callback err if err
        return callback null, null if executed == false
        docker.exec cmd,  options, false, (err, executed, stdout, stderr) ->
          callback err, executed, stdout, stderr

## Modules Dependencies

    docker = require '../misc/docker'
    util = require 'util'