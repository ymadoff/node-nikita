
# Misc DB

## Escape

Escape SQL for Bash processing.

    module.exports.escape = (sql) ->
      sql.replace /[\\"]/g, "\\$&"

## Build a Unix command
    
    module.exports.cmd = (opts...) ->
      properties = ['engine', 'cmd', 'admin_username', 'admin_password', 'username', 'password', 'host', 'database','silent']
      options = {}
      for opt in opts
        opt = cmd: opt if typeof opt is 'string'
        for k, v of opt
          continue unless k in properties
          options[k] = v
      options.engine = options.engine.toLowerCase()
      options.admin_password = null unless options.admin_username
      options.silent ?= true
      throw Error "Required Option: \"engine\"" unless options.engine
      throw Error "Required Option: \"host\"" unless options.host
      throw Error "Required Option: \"admin_username\" or \"username\"" unless options.admin_username or options.username
      switch options.engine
        when 'mysql'
          options.path ?= 'mysql'
          options.port ?= '3306'
          [
            "mysql"
            "-h#{options.host}"
            "-P#{options.port}"
            "-u#{options.admin_username or options.username}"
            "-p'#{options.admin_password or options.password}'"
            "-D#{options.database}" if options.database
            "#{options.mysql_options}" if options.mysql_options
            # -N, --skip-column-names   Don't write column names in results.
            # -s, --silent              Be more silent. Print results with a tab as separator, each row on new line.
            # -r, --raw                 Write fields without conversion. Used with --batch.
            "-N -s -r" if options.silent
            "-e \"#{module.exports.escape options.cmd}\"" if options.cmd
          ].join ' '
        when 'postgres'
          options.path ?= 'psql'
          options.port ?= '5432'
          [
            "PGPASSWORD=#{options.admin_password or options.password}"
            "psql"
            "-h #{options.host}"
            "-p #{options.port}"
            "-U #{options.admin_username or options.username}"
            "-d #{options.database}" if options.database
            "#{options.postgres_options}" if options.postgres_options
            # -t, --tuples-only        Print rows only
            # -A, --no-align           Unaligned table output mode
            # -q, --quiet              Run quietly (no messages, only query output)
            "-tAq"
            "-c \"#{options.cmd}\"" if options.cmd
          ].join ' '
        else
          throw Error "Unsupported engine: #{JSON.stringify options.engine}"

## Parse JDBC URL

Enrich the result of `url.parse` with the "engine" and "db" properties.

Exemple:

```
parse 'jdbc:mysql://host1:3306,host2:3306/hive?createDatabaseIfNotExist=true'
{ engine: 'mysql',
  addresses: 
   [ { host: 'host1', port: '3306' },
     { host: 'host2', port: '3306' } ],
  database: 'hive' }
```

    module.exports.jdbc = (jdbc) ->
      if /^jdbc:mysql:/.test jdbc
        [_, engine, addresses, database] = /^jdbc:(.*?):\/+(.*?)\/(.*?)(\?(.*)|$)/.exec jdbc
        addresses = addresses.split(',').map (address) ->
          [host, port] = address.split ':'
          host: host, port: port or 3306
        engine: 'mysql'
        addresses: addresses
        database: database
      else if /^jdbc:postgresql:/.test jdbc
        [_, engine, addresses, database] = /^jdbc:(.*?):\/+(.*?)\/(.*?)(\?(.*)|$)/.exec jdbc
        addresses = addresses.split(',').map (address) ->
          [host, port] = address.split ':'
          host: host, port: port or 5432
        engine: 'postgres'
        addresses: addresses
        database: database
      else
        throw Error 'Invalid JDBC URL'
    
## Dependencies

    misc = require '.'
