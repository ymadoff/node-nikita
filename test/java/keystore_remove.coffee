
nikita = require '../../src'
they = require 'ssh2-they'
test = require '../test'

describe 'java.keystore_remove', ->

  scratch = test.scratch @

  describe 'options', ->

    they 'keystore doesnt need to exists', (ssh, next) ->
      nikita
        ssh: ssh
      .java.keystore_remove
        keystore: "#{scratch}/does/not/exist"
        storepass: "invalid"
        caname: "invalid"
      , (err, status) ->
        status.should.be.false() unless err
      .then next

    they 'caname or name must be provided', (ssh, next) ->
      nikita
        ssh: ssh
      .java.keystore_remove
        keystore: "invalid"
        storepass: "invalid"
        caname: "invalid"
      , (err) ->
        err.message.should.eql "Required option 'name' or 'caname'"
      .then -> next()

  describe 'cacert', ->

    they 'remove cacerts', (ssh, next) ->
      keystore =  "#{scratch}/cacerts"
      caname = 'my_alias'
      storepass = 'changeit'
      nikita
        ssh: ssh
      .java.keystore_add
        keystore: "#{keystore}"
        storepass: "#{storepass}"
        caname: "#{caname}"
        cacert: "#{__dirname}/keystore/certs1/cacert.pem"
      .java.keystore_remove
        keystore: "#{keystore}"
        storepass: "#{storepass}"
        caname: "#{caname}"
      , (err, status) ->
        status.should.be.true() unless err
      .java.keystore_remove
        keystore: "#{keystore}"
        storepass: "#{storepass}"
        caname: "#{caname}"
      , (err, status) ->
        status.should.be.false() unless err
      .system.execute
        cmd: """
        keytool -list -keystore #{keystore} -storepass #{storepass} -alias #{caname}
        """
        code: 1
      .then next

  describe 'key', ->

    they 'remove cacerts file', (ssh, next) ->
      keystore =  "#{scratch}/cacerts"
      caname = 'my_alias'
      storepass = 'changeit'
      keypass = 'mypassword'
      name = 'node_1'
      nikita
        ssh: ssh
      .java.keystore_add
        keystore: "#{keystore}"
        storepass: "#{storepass}"
        caname: "#{caname}"
        cacert: "#{__dirname}/keystore/certs1/cacert.pem"
        key: "#{__dirname}/keystore/certs1/node_1_key.pem"
        cert: "#{__dirname}/keystore/certs1/node_1_cert.pem"
        keypass: 'mypassword'
        name: "#{name}"
      .java.keystore_remove
        keystore: "#{keystore}"
        storepass: "#{storepass}"
        name: "#{name}"
        keypass: "#{keypass}"
      , (err, status) ->
        status.should.be.true() unless err
      .java.keystore_remove
        keystore: "#{keystore}"
        storepass: "#{storepass}"
        name: "#{name}"
        keypass: "#{keypass}"
      , (err, status) ->
        status.should.be.false() unless err
      .system.execute
        cmd: """
        keytool -list -keystore #{keystore} -storepass #{storepass} -alias #{name}
        """
        code: 1
      .then next
