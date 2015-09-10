
mecano = require '../../src'
test = require '../test'
fs = require 'fs'
domain = require 'domain'

describe 'api callback', ->

  scratch = test.scratch @

  it 'register actions in callback', (next) ->
    msgs = []
    m = mecano log: (msg) -> msgs.push msg if /\/file_\d/.test msg
    m
    .write
      destination: "#{scratch}/a_file"
      content: 'abc'
    , (err, written) ->
      return next err if err
      m.write
        destination: "#{scratch}/a_file"
        content: 'def'
        append: true
      , (err, written) ->
        # ok
    .write
      destination: "#{scratch}/a_file"
      content: 'hij'
      append: true
    .then (err, changed) ->
      return next err if err
      fs.readFile "#{scratch}/a_file", 'ascii', (err, content) ->
        return next err if err
        content.should.eql 'abcdefhij'
        next()

  it 'catch error', (next) ->
    # msgs = []
    # m = mecano log: (msg) -> msgs.push msg if /\/file_\d/.test msg
    mecano()
    .write
      destination: "#{scratch}/a_file"
      content: 'abc'
    , (err, written) ->
      throw Error 'Catchme'
    .write
      invalid: true
    .then (err, changed) ->
      err.message.should.eql 'Catchme'
      next()


