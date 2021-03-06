
# `nikita.ldap.add(options, [callback])`

Insert or modify an entry inside an OpenLDAP server.   

## Options

*   `entry` (object | array)   
    Object to be inserted or modified.   
*   `uri`   
    Specify URI referring to the ldap server.   
*   `binddn`   
    Distinguished Name to bind to the LDAP directory.   
*   `passwd`   
    Password for simple authentication.   
*   `name`   
    Distinguish name storing the "olcAccess" property, using the database adress
    (eg: "olcDatabase={2}bdb,cn=config").   
*   `overwrite`   
    Overwrite existing "olcAccess", default is to merge.   

## Example

```js
require('nikita').ldap.index({
  url: 'ldap://openldap.server/',
  binddn: 'cn=admin,cn=config',
  passwd: 'password',
  entry: {
    dn: 'cn=group1,ou=groups,dc=company,dc=com'
    cn: 'group1'
    objectClass: 'top'
    objectClass: 'posixGroup'
    gidNumber: 9601
  }
}, function(err, modified){
  console.log(err ? err.message : 'Entry modified: ' + !!modified);
});
```

## Source Code

    module.exports = (options, callback) ->
      # Auth related options
      binddn = if options.binddn then "-D #{options.binddn}" else ''
      passwd = if options.passwd then "-w #{options.passwd}" else ''
      if options.url
        console.log "Nikita: option 'options.url' is deprecated, use 'options.uri'"
        options.uri ?= options.url
      options.uri = 'ldapi:///' if options.uri is true
      uri = if options.uri then "-H #{options.uri}" else '' # URI is obtained from local openldap conf unless provided
      # Add related options
      return callback Error "Nikita `ldap.add`: required property 'entry'" unless options.entry
      options.entry = [options.entry] unless Array.isArray options.entry
      ldif = ''
      for entry in options.entry
        return callback Error "Nikita `ldap.add`: required property 'dn'" unless entry.dn
        ldif += '\n'
        ldif += "dn: #{entry.dn}\n"
        [_, k, v] = /^(.*?)=(.+?),.*$/.exec entry.dn
        ldif += "#{k}: #{v}\n"
        if entry[k]
          throw Error "Inconsistent value: #{entry[k]} is not #{v} for attribute #{k}" if entry[k] isnt v
          delete entry[k]
        for k, v of entry
          continue if k is 'dn'
          v = [v] unless Array.isArray v
          for vv in v
            ldif += "#{k}: #{vv}\n"
      modified = false
      # We keep -c for now because we accept multiple entries. In the future, 
      # we shall detect modification and be more strict.
      # -c  Continuous operation mode.  Errors are reported, but ldapmodify will
      # continue with modifications.  The default is to exit after reporting an
      # error.
      @system.execute
        cmd: """
        ldapadd -c #{binddn} #{passwd} #{uri} \
        <<-EOF
        #{ldif}
        EOF
        """
        code_skipped: 68
      , (err, executed, stdout, stderr) ->
        return callback err if err
        modified = stderr.match(/Already exists/g)?.length isnt stdout.match(/adding new entry/g).length
        added = modified # For now, we dont modify
        callback err, modified, added
