
nikita = require '../../src'
test = require '../test'
fs = require 'fs'

describe 'api options', ->

  it 'global dont overwrite local options', (next) ->
    m = nikita
      global_param: true
    m.propagated_options.push 'parent_param_propagated'
    m.registry.register 'achild', (options, callback) ->
      options.local_param.should.be.true()
      options.parent_param_propagated.should.be.true()
      (options.parent_param_unpropagated is undefined).should.be.true()
      options.global_param.should.be.true()
      callback null, true
    m.registry.register 'aparent', (options, callback) ->
      options.global_param.should.be.true()
      options.parent_param_propagated.should.be.true()
      options.parent_param_unpropagated.should.be.true()
      @achild
        local_param: true
      .then (err, status) -> callback err, true
    m.aparent
      parent_param_propagated: true
      parent_param_unpropagated: true
    .then next

  it 'accept empty array [async]', (next) ->
    nikita
    .call [], (options, callback) ->
      callback null, true
    .file []
    .then (err, status) ->
      status.should.be.false() unless err
      next err

  it 'accept empty array [sync]', (next) ->
    nikita
    .call [], (options) ->
      return true
    .file []
    .then (err, status) ->
      status.should.be.false() unless err
      next err

  describe 'merging', ->

    it 'accept multiple options', (next) ->
      nikita
      .call {a: 1, b: 0}, {b: 2, c: 3}, (options) ->
        options.should.containEql a: 1, b: 2, c: 3
      .then next

    it 'is immutable', (next) ->
      opts1 = {a: 1, b: 0}
      opts2 = {b: 2, c: 3}
      nikita
      .call opts1, opts2, (options) ->
        options.should.containEql a: 1, b: 2, c: 3
      , ->
        opts1.should.eql {a: 1, b: 0}
        opts2.should.eql {b: 2, c: 3}
      .then next
