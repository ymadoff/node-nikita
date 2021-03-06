
os = require 'os'
nikita = require '../../src'
they = require 'ssh2-they'
test = require '../test'
fs = require 'ssh2-fs'

describe 'system.limits', ->

  scratch = test.scratch @

  they 'do nothing without any limits', (ssh, next) ->
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
    , (err, status) ->
      return next err if err
      status.should.be.false()
      fs.exists ssh, "#{scratch}/me.conf", (err, exists) ->
        exists.should.be.false() unless err
        next err

  they 'nofile and noproc accept int', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile: 2048
      nproc: 2048
    , (err, status) ->
      return next err if err
      status.should.be.true()
      fs.readFile ssh, "#{scratch}/me.conf", 'ascii', (err, content) ->
        content.should.eql """
        me    -    nofile    2048
        me    -    nproc    2048

        """ unless err
        next err

  they 'set global value', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      system: true
      nofile: 2048
      nproc: 2048
    , (err, status) ->
      return next err if err
      status.should.be.true()
      fs.readFile ssh, "#{scratch}/me.conf", 'ascii', (err, content) ->
        content.should.eql """
        *    -    nofile    2048
        *    -    nproc    2048

        """ unless err
        next err

  they 'specify hard and soft values', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile:
        soft: 2048
        hard: 4096
    , (err, status) ->
      return next err if err
      status.should.be.true()
      fs.readFile ssh, "#{scratch}/me.conf", 'ascii', (err, content) ->
        content.should.eql """
        me    soft    nofile    2048
        me    hard    nofile    4096

        """ unless err
        next err

  they 'detect changes', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile: 2048
      nproc: 2048
      shy: true
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile: 2047
      nproc: 2047
    .then (err, status) ->
      status.should.be.true() unless err
      next err

  they 'detect no change', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile: 2048
      nproc: 2048
      shy: true
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile: 2048
      nproc: 2048
    .then (err, status) ->
      status.should.be.false() unless err
      next err

  they 'nofile and noproc default to 75% of kernel limits', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nproc = null
    nofile = null
    fs.exists ssh, '/proc/sys/fs/file-max', (err, exists) ->
      return next() unless exists # Not linux
      nikita
        ssh: ssh
      .system.execute
        cmd: 'cat /proc/sys/fs/file-max'
      , (err, status, stdout) ->
        return next err if err
        nofile = stdout.trim()
        nofile = Math.round parseInt(nofile)*0.75
      .system.execute
        cmd: 'cat /proc/sys/kernel/pid_max'
      , (err, status, stdout) ->
        return next err if err
        nproc = stdout.trim()
        nproc = Math.round parseInt(nproc)*0.75
      .system.limits
        target: "#{scratch}/me.conf"
        user: 'me'
        nofile: true
        nproc: true
      , (err, status) ->
        return next err if err
        status.should.be.true()
        fs.readFile ssh, "#{scratch}/me.conf", 'ascii', (err, content) ->
          content.should.eql """
          me    -    nofile    #{nofile}
          me    -    nproc    #{nproc}

          """ unless err
          next err

  they 'raise an error if nofile is too high', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile: 1000000000
    , (err, status) ->
      err.message.should.match /^Invalid nofile options.*$/
      next()

  they 'raise an error if nproc is too high', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nproc: 1000000000
    , (err, status) ->
      err.message.should.match /^Invalid nproc options.*$/
      next()

  they 'raise an error if hardness is incoherent', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nproc:
        hard: 12
        toto: 24
    , (err, status) ->
      err.message.should.match /^Invalid option.*$/
      next()

  they 'accept value \'unlimited\'', (ssh, next) ->
    return next() unless os.platform() is 'linux'
    nikita
      ssh: ssh
    .system.limits
      target: "#{scratch}/me.conf"
      user: 'me'
      nofile: 2048
      nproc: 'unlimited'
    , (err, status) ->
      return next err if err
      status.should.be.true()
      fs.readFile ssh, "#{scratch}/me.conf", 'ascii', (err, content) ->
        content.should.eql """
        me    -    nofile    2048
        me    -    nproc    unlimited

        """ unless err
        next err
