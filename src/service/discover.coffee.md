
# `nikita.service.discover(options, [callback])`

Discover the OS init loader.
For now it only supports Centos/Redhat OS in version 6 or 7, ubuntu.
Store properties in the nikita store object.

## Options

*   `strict` (boolean)   
    Throw an error if the OS is not supported. false by default.   
*   `cache`   
    Disable cache. false by default   

## Callback parameters

*   `err`   
    Error object if any.   
*   `status`   
    Indicate a change in service such as a change in installation, update, 
    start/stop or startup registration.   
*   `loader`   
    the init loader name   

## Source Code

    module.exports = (options, callback) ->
      detected = false
      loader = null
      options.strict ?= false
      options.shy ?= true
      options.cache ?= true
      @system.execute
        shy: options.shy
        unless: options.store['nikita:service:loader']?
        cmd: """
        if which systemctl >/dev/null; then exit 1; fi ;
        if which service >/dev/null; then exit 2; fi ;
        exit 3 ;
        """
        code: [1, 2]
        shy: true
      , (err, status, stdout, stderr, signal) ->
        throw Error "Undetected Operating System Loader" if err?.code is 3 and options.strict
        options.store ?= {}
        loader = switch signal
          when 1 then 'systemctl'
          when 2 then 'service'
        options.store['nikita:service:loader'] = options.loader if options.cache
      @then (err, status) ->
        loader = options.store['nikita:service:loader']? if options.cache and not loader?
        callback err, status, loader
