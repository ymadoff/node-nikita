# Nikita

Nikita gather a set of functions usually used during system deployment. All the
functions share a common API with flexible options.

*   Run actions both locally and remotely over SSH.
*   Ability to see if an action had an effect through the second argument
    provided in the callback.
*   Common API with options and callback arguments and calling the callback with
    an error and the number of affected actions.
*   Run one or multiple actions depending on option argument being an object or
    an array of objects.

## Source Code

    module.exports = new Proxy (-> context arguments...),
      get: (target, name) ->
        ctx = context()
        tree = []
        tree.push name
        builder = ->
          return registry[name].apply registry, arguments if name in ['get', 'register', 'deprecate', 'registered', 'unregister']
          a = ctx[tree.shift()]
          return a unless typeof a is 'function'
          while name = tree.shift()
            a[name]
          a.apply ctx, arguments
        proxy = new Proxy builder,
          get: (target, name) ->
            tree.push name
            proxy
        proxy

## Dependencies

    context = require './context'
    registry = require './registry'

## Register

    registry.register
      assert: 'nikita/core/assert'
      kv:
        get: 'nikita/core/kv/get'
        engine: 'nikita/core/kv/engine'
        set: 'nikita/core/kv/set'
      cron:
        add: 'nikita/cron/add'
        remove: 'nikita/cron/remove'
      db:
        database:
          '': 'nikita/db/database'
          exists: 'nikita/db/database/exists'
          remove: 'nikita/db/database/remove'
          wait: 'nikita/db/database/wait'
        schema:
          '': 'nikita/db/schema'
          remove: 'nikita/db/schema/remove'
        user:
          '': 'nikita/db/user'
          exists: 'nikita/db/user/exists'
          remove: 'nikita/db/user/remove'
      docker:
        build: 'nikita/docker/build'
        checksum: 'nikita/docker/checksum'
        compose:
          '': 'nikita/docker/compose'
          up: 'nikita/docker/compose'
        cp: 'nikita/docker/cp'
        exec: 'nikita/docker/exec'
        kill: 'nikita/docker/kill'
        load: 'nikita/docker/load'
        pause: 'nikita/docker/pause'
        pull: 'nikita/docker/pull'
        restart: 'nikita/docker/restart'
        rm: 'nikita/docker/rm'
        rmi: 'nikita/docker/rmi'
        run: 'nikita/docker/run'
        save: 'nikita/docker/save'
        service: 'nikita/docker/service'
        start: 'nikita/docker/start'
        status: 'nikita/docker/status'
        stop: 'nikita/docker/stop'
        unpause: 'nikita/docker/unpause'
        volume_create: 'nikita/docker/volume_create'
        volume_rm: 'nikita/docker/volume_rm'
        wait: 'nikita/docker/wait'
      file:
        '': 'nikita/file'
        assert: 'nikita/file/assert'
        cache: 'nikita/file/cache'
        cson: 'nikita/file/cson'
        download: 'nikita/file/download'
        ini: 'nikita/file/ini'
        json: 'nikita/file/json'
        properties: 'nikita/file/properties'
        render: 'nikita/file/render'
        touch: 'nikita/file/touch'
        upload: 'nikita/file/upload'
        yaml: 'nikita/file/yaml'
        types:
          locale_gen: 'nikita/file/types/locale_gen'
          pacman_conf: 'nikita/file/types/pacman_conf'
          yum_repo: 'nikita/file/types/yum_repo'
      java:
        keystore_add: 'nikita/java/keystore_add'
        keystore_remove: 'nikita/java/keystore_remove'
      krb5:
        addprinc: 'nikita/krb5/addprinc'
        delprinc: 'nikita/krb5/delprinc'
        ktadd: 'nikita/krb5/ktadd'
        ticket: 'nikita/krb5/ticket'
      ldap:
        acl: 'nikita/ldap/acl'
        add: 'nikita/ldap/add'
        delete: 'nikita/ldap/delete'
        index: 'nikita/ldap/index'
        schema: 'nikita/ldap/schema'
        user: 'nikita/ldap/user'
      log:
        cli: 'nikita/log/cli'
        fs: 'nikita/log/fs'
        md: 'nikita/log/md'
        csv: 'nikita/log/csv'
      connection:
        assert: 'nikita/connection/assert'
        wait: '': 'nikita/connection/wait'
      service:
        '': 'nikita/service'
        discover: 'nikita/service/discover'
        install: 'nikita/service/install'
        init: 'nikita/service/init'
        remove: 'nikita/service/remove'
        restart: 'nikita/service/restart'
        start: 'nikita/service/start'
        startup: 'nikita/service/startup'
        status: 'nikita/service/status'
        stop: 'nikita/service/stop'
      system:
        cgroups: 'nikita/system/cgroups'
        chmod: 'nikita/system/chmod'
        chown: 'nikita/system/chown'
        copy: 'nikita/system/copy'
        discover: 'nikita/system/discover'
        execute: 'nikita/system/execute'
        group:
          '': 'nikita/system/group/index'
          remove: 'nikita/system/group/remove'
        limits: 'nikita/system/limits'
        link: 'nikita/system/link'
        mkdir: 'nikita/system/mkdir'
        move: 'nikita/system/move'
        remove: 'nikita/system/remove'
        tmpfs: 'nikita/system/tmpfs'
        user:
          '': 'nikita/system/user/index'
          remove: 'nikita/system/user/remove'
      ssh:
        open: 'nikita/ssh/open'
        close: 'nikita/ssh/close'
        root: 'nikita/ssh/root'
      tools:
        backup: 'nikita/tools/backup'
        compress: 'nikita/tools/compress'
        extract: 'nikita/tools/extract'
        iptables: 'nikita/tools/iptables'
        git: 'nikita/tools/git'
        repo: 'nikita/tools/repo'
      wait:
        '': 'nikita/wait'
        execute: 'nikita/wait/execute'
        exist: 'nikita/wait/exist'
    
    # Backward compatibility
    registry.deprecate 'backup', 'nikita/tools/backup'
    registry.deprecate 'cgroups', 'nikita/system/cgroups'
    registry.deprecate 'chmod', 'nikita/system/chmod'
    registry.deprecate 'chown', 'nikita/system/chown'
    registry.deprecate 'compress', 'nikita/tools/compress'
    registry.deprecate 'copy', 'nikita/system/copy'
    registry.deprecate 'cron_add', 'nikita/cron/add'
    registry.deprecate 'cron_remove', 'nikita/cron/remove'
    registry.deprecate 'docker_build', 'nikita/docker/build'
    registry.deprecate 'docker_checksum', 'nikita/docker/checksum'
    registry.deprecate 'docker_cp', 'nikita/docker/cp'
    registry.deprecate 'docker_exec', 'nikita/docker/exec'
    registry.deprecate 'docker_kill', 'nikita/docker/kill'
    registry.deprecate 'docker_load', 'nikita/docker/load'
    registry.deprecate 'docker_pause', 'nikita/docker/pause'
    registry.deprecate 'docker_restart', 'nikita/docker/restart'
    registry.deprecate 'docker_rm', 'nikita/docker/rm'
    registry.deprecate 'docker_rmi', 'nikita/docker/rmi'
    registry.deprecate 'docker_run', 'nikita/docker/run'
    registry.deprecate 'docker_save', 'nikita/docker/save'
    registry.deprecate 'docker_service', 'nikita/docker/service'
    registry.deprecate 'docker_start', 'nikita/docker/start'
    registry.deprecate 'docker_status', 'nikita/docker/status'
    registry.deprecate 'docker_stop', 'nikita/docker/stop'
    registry.deprecate 'docker_unpause', 'nikita/docker/unpause'
    registry.deprecate 'docker_volume_create', 'nikita/docker/volume_create'
    registry.deprecate 'docker_volume_rm', 'nikita/docker/volume_rm'
    registry.deprecate 'docker_wait', 'nikita/docker/wait'
    registry.deprecate 'download', 'nikita/file/download'
    registry.deprecate 'execute', 'nikita/system/execute'
    registry.deprecate 'extract', 'nikita/tools/extract'
    registry.deprecate 'cache', 'nikita/file/cache'
    registry.deprecate 'git', 'nikita/tools/git'
    registry.deprecate 'group', 'nikita/system/group'
    registry.deprecate 'java_keystore_add', 'nikita/java/keystore_add'
    registry.deprecate 'java_keystore_remove', 'nikita/java/keystore_remove'
    registry.deprecate 'iptables', 'nikita/tools/iptables'
    registry.deprecate 'krb5_addprinc', 'nikita/krb5/addprinc'
    registry.deprecate 'krb5_delprinc', 'nikita/krb5/delprinc'
    registry.deprecate 'krb5_ktadd', 'nikita/krb5/ktadd'
    registry.deprecate 'ldap_acl', 'nikita/ldap/acl'
    registry.deprecate 'ldap_add', 'nikita/ldap/add'
    registry.deprecate 'ldap_delete', 'nikita/ldap/delete'
    registry.deprecate 'ldap_index', 'nikita/ldap/index'
    registry.deprecate 'ldap_schema', 'nikita/ldap/schema'
    registry.deprecate 'ldap_user', 'nikita/ldap/user'
    registry.deprecate 'link', 'nikita/system/link'
    registry.deprecate 'mkdir', 'nikita/system/mkdir'
    registry.deprecate 'move', 'nikita/system/move'
    registry.deprecate 'remove', 'nikita/system/remove'
    registry.deprecate 'render', 'nikita/file/render'
    registry.deprecate 'service_install', 'nikita/service/install'
    registry.deprecate 'service_remove', 'nikita/service/remove'
    registry.deprecate 'service_restart', 'nikita/service/restart'
    registry.deprecate 'service_start', 'nikita/service/start'
    registry.deprecate 'service_startup', 'nikita/service/startup'
    registry.deprecate 'service_status', 'nikita/service/status'
    registry.deprecate 'service_stop', 'nikita/service/stop'
    registry.deprecate 'system_limits', 'nikita/system/limits'
    registry.deprecate 'touch', 'nikita/file/touch'
    registry.deprecate 'upload', 'nikita/file/upload'
    registry.deprecate 'user', 'nikita/system/user'
    registry.deprecate 'wait_connect', 'nikita/connection/wait'
    registry.deprecate 'wait_execute', 'nikita/wait/execute'
    registry.deprecate 'wait_exist', 'nikita/wait/exist'
    registry.deprecate 'write', 'nikita/file'
    registry.deprecate 'write_ini', 'nikita/file/ini'
    registry.deprecate 'write_properties', 'nikita/file/properties'
    registry.deprecate 'write_yaml', 'nikita/file/yaml'
