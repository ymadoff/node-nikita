
nikita = require '../../src'
misc = require '../../src/misc'
test = require '../test'
they = require 'ssh2-they'
fs = require 'ssh2-fs'

describe 'file.properties', ->

  scratch = test.scratch @

  they 'overwrite by default', (ssh, next) ->
    nikita
      ssh: ssh
    .file.properties
      target: "#{scratch}/file.properties"
      content: a_key: 'a value'
    , (err, status) ->
      status.should.be.true() unless err
    .file.properties
      target: "#{scratch}/file.properties"
      content: another_key: 'another value'
    , (err, status) ->
      status.should.be.true() unless err
    .file.properties
      target: "#{scratch}/file.properties"
      content: another_key: 'another value'
    , (err, status) ->
      status.should.be.false() unless err
    .call (_, callback)->
      fs.readFile ssh, "#{scratch}/file.properties", 'ascii', (err, data) ->
        data.should.eql "another_key=another value\n" unless err
        callback err
    .then next
    
  they 'honors merge', (ssh, next) ->
    nikita
      ssh: ssh
    .file.properties
      target: "#{scratch}/file.properties"
      content: a_key: 'a value'
    , (err, status) ->
      status.should.be.true() unless err
    .file.properties
      target: "#{scratch}/file.properties"
      content: another_key: 'another value'
      merge: true
    , (err, status) ->
      status.should.be.true() unless err
    .file.properties
      target: "#{scratch}/file.properties"
      content: another_key: 'another value'
      merge: true
    , (err, status) ->
      status.should.be.false() unless err
    .call (_, callback)->
      fs.readFile ssh, "#{scratch}/file.properties", 'ascii', (err, data) ->
        data.should.eql "a_key=a value\nanother_key=another value\n" unless err
        callback err
    .then next

  they 'honor separator', (ssh, next) ->
    nikita
      ssh: ssh
    .file.properties
      target: "#{scratch}/file.properties"
      content: a_key: 'a value'
      separator: ' '
    .file.properties
      target: "#{scratch}/file.properties"
      content: another_key: 'another value'
      separator: ' '
      merge: true
    .call (_, callback)->
      fs.readFile ssh, "#{scratch}/file.properties", 'ascii', (err, data) ->
        data.should.eql "a_key a value\nanother_key another value\n" unless err
        callback err
    .then next

  they 'honor sort', (ssh, next) ->
    nikita
      ssh: ssh
    .file.properties
      target: "#{scratch}/file.properties"
      content:
        b_key: 'value'
        a_key: 'value'
      sort: false
    .call (_, callback) ->
      fs.readFile ssh, "#{scratch}/file.properties", 'ascii', (err, data) ->
        return callback err if err
        data.should.eql "b_key=value\na_key=value\n"
        callback()
    .file.properties
      target: "#{scratch}/file.properties"
      content:
        b_key: 'value'
        a_key: 'value'
      sort: true
    .call (_, callback) ->
      fs.readFile ssh, "#{scratch}/file.properties", 'ascii', (err, data) ->
        data.should.eql "a_key=value\nb_key=value\n" unless err
        callback err
    .then next

  they 'honor comments', (ssh, next) ->
    nikita
      ssh: ssh
    .file
      target: "#{scratch}/file.properties"
      content: """
      a_key=value
      # comment
      b_key=value
      """
    .file.properties
      target: "#{scratch}/file.properties"
      content:
        b_key: 'new value'
        a_key: 'new value'
      merge: true
      comment: true
    .call (_, callback) ->
      fs.readFile ssh, "#{scratch}/file.properties", 'ascii', (err, data) ->
        data.should.eql "a_key=new value\n# comment\nb_key=new value\n" unless err
        callback err
    .then next
