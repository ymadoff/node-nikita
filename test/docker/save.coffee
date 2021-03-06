should = require 'should'
nikita = require '../../src'
test = require '../test'
they = require 'ssh2-they'
fs = require 'ssh2-fs'


describe 'docker.save', ->

  scratch = test.scratch @
  config = test.config()
  return if config.disable_docker

  they 'saves a simple image', (ssh, next) ->
    nikita
      ssh: ssh
      docker: config.docker
    .system.remove
      target:"#{scratch}/nikita_saved.tar"
    .docker.build
      image: 'nikita/load_test'
      content: "FROM alpine\nCMD ['echo \"hello build from text\"']"
    .docker.save
      image: 'nikita/load_test:latest'
      output: "#{scratch}/nikita_saved.tar"
    , (err, saved) ->
      saved.should.be.true() unless err
    .system.remove
      target:"#{scratch}/nikita_saved.tar"
    .then next

  # they 'status not modified', (ssh, next) ->
  #   nikita
  #     ssh: ssh
  #   .system.remove
  #     target:"#{scratch}/nikita_saved.tar"
  #   .docker.build
  #     image: 'nikita/load_test'
  #     content: "FROM scratch\nCMD ['echo \"hello build from text\"']"
  #     machine: config.docker.machine
  #   .docker.save
  #     image: 'nikita/load_test:latest'
  #     output: "#{scratch}/nikita_saved.tar"
  #     machine: config.docker.machine
  #   .docker.save
  #     image: 'nikita/load_test:latest'
  #     output: "#{scratch}/nikita_saved.tar"
  #     machine: config.docker.machine
  #   , (err, saved) ->
  #     saved.should.be.false()
  #     nikita
  #       ssh: ssh
  #     .system.remove
  #       target:"#{scratch}/nikita_saved.tar"
  #     .then next
