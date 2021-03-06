should = require 'should'
nikita = require '../../src'
test = require '../test'
they = require 'ssh2-they'
fs = require 'ssh2-fs'
docker = require '../../src/misc/docker'

describe 'docker.rmi', ->

  scratch = test.scratch @
  config = test.config()
  return if config.disable_docker

  they 'remove image', (ssh, next) ->
    nikita
      ssh: ssh
      docker: config.docker
    .docker.build
      image: 'nikita/rmi_test'
      content: "FROM scratch\nCMD ['echo \"hello build from text\"']"
    .docker.rmi
      image: 'nikita/rmi_test'
    , (err, removed, stdout, stderr) ->
      return err if err
      removed.should.be.true()
    .then next

  they 'status unmodifed', (ssh, next) ->
    nikita
      ssh: ssh
      docker: config.docker
    .docker.build
      image: 'nikita/rmi_test:latest'
      content: "FROM scratch\nCMD ['echo \"hello build from text\"']"
    .docker.rmi
      image: 'nikita/rmi_test'
    .docker.rmi
      image: 'nikita/rmi_test'
    , (err, removed) ->
      removed.should.be.false()
    .then next
