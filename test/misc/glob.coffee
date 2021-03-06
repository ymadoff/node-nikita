
glob = require '../../src/misc/glob'
test = require '../test'
they = require 'ssh2-they'
path = require 'path'

describe 'misc glob', ->

  they 'should traverse a directory', (ssh, next) ->
    glob ssh, "#{__dirname}/../../lib/*", (err, files) ->
      return next err if err
      files.should.not.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
      next()

  they 'should traverse a directory recursively', (ssh, next) ->
    glob ssh, "#{__dirname}/../../lib/**", (err, files) ->
      return next err if err
      files.should.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
      next()

  they 'should match an extension patern', (ssh, next) ->
    glob ssh, "#{__dirname}/../../lib/*.js", (err, files) ->
      return next err if err
      files.should.not.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
      next()

  they 'should match an extension patern in recursion', (ssh, next) ->
    glob ssh, "#{__dirname}/../../**/*.js", (err, files) ->
      return next err if err
      files.should.not.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
      next()

  they 'return an empty array on no match', (ssh, next) ->
    glob ssh, "#{__dirname}/../doesnotexist/*.js", (err, files) ->
      return next err if err
      files.should.not.equal []
      next()

  they 'include dot', (ssh, next) ->
    glob ssh, "#{__dirname}/../../*", dot: 1, (err, files) ->
      return next err if err
      files.should.containEql path.normalize "#{__dirname}/../../.git"
      files.should.containEql path.normalize "#{__dirname}/../../.gitignore"
      next()
