// Generated by CoffeeScript 1.12.4
module.exports = function(options) {
  options.log({
    message: "Entering service.startup",
    level: 'DEBUG',
    module: 'nikita/lib/service/startup'
  });
  if (typeof options.argument === 'string') {
    if (options.name == null) {
      options.name = options.argument;
    }
  }
  if (options.startup == null) {
    options.startup = true;
  }
  if (Array.isArray(options.startup)) {
    options.startup = [options.startup];
  }
  if (options.name == null) {
    throw Error("Invalid Name: " + (JSON.stringify(options.name)));
  }
  options.log({
    message: "Startup service " + options.name,
    level: 'INFO',
    module: 'nikita/lib/service/startup'
  });
  this.system.execute({
    unless: options.cmd,
    cmd: "if which systemctl >/dev/null 2>&1; then\n  echo 'systemctl'\nelif which chkconfig >/dev/null 2>&1; then\n  echo 'chkconfig'\nelif which update-rc.d >/dev/null 2>&1; then\n  echo 'update-rc'\nelse\n  echo \"Unsupported Loader\" >&2\n  exit 2\nfi",
    shy: true
  }, function(err, _, stdout) {
    var ref;
    if (err) {
      throw err;
    }
    options.cmd = stdout.trim();
    if ((ref = options.cmd) !== 'systemctl' && ref !== 'chkconfig' && ref !== 'update-rc') {
      throw Error("Unsupported Loader");
    }
  });
  this.system.execute({
    "if": function() {
      return options.cmd === 'systemctl';
    },
    cmd: "startup=" + (options.startup ? '1' : '') + "\nif systemctl is-enabled " + options.name + "; then\n  [ -z \"$startup\" ] || exit 3\n  echo 'Disable " + options.name + "'\n  systemctl disable " + options.name + "\nelse\n  [ -z \"$startup\" ] && exit 3\n  echo 'Enable " + options.name + "'\n  systemctl enable " + options.name + "\nfi",
    trap: true,
    code_skipped: 3,
    arch_chroot: options.arch_chroot,
    rootdir: options.rootdir
  }, function(err, status) {
    var message;
    if (err && options.startup) {
      err = Error("Startup Enable Failed: " + options.name);
    }
    if (err && !options.startup) {
      err = Error("Startup Disable Failed: " + options.name);
    }
    if (err) {
      throw err;
    }
    message = options.startup ? 'activated' : 'disabled';
    return options.log(status ? {
      message: "Service startup updated: " + message,
      level: 'WARN',
      module: 'nikita/lib/service/remove'
    } : {
      message: "Service startup not modified: " + message,
      level: 'INFO',
      module: 'nikita/lib/service/remove'
    });
  });
  this.call({
    "if": function() {
      return options.cmd === 'chkconfig';
    }
  }, function(_, callback) {
    return this.system.execute({
      "if": function() {
        return options.cmd === 'chkconfig';
      },
      cmd: "chkconfig --list " + options.name,
      code_skipped: 1
    }, function(err, registered, stdout, stderr) {
      var c, current_startup, j, len, level, ref, ref1, status;
      if (err) {
        return callback(err);
      }
      if (/^error/.test(stderr)) {
        options.log({
          message: "Invalid chkconfig name for \"" + options.name + "\"",
          level: 'ERROR',
          module: 'mecano/lib/service/startup'
        });
        throw Error("Invalid chkconfig name for `" + options.name + "`");
      }
      current_startup = '';
      if (registered) {
        ref = stdout.split(' ').pop().trim().split('\t');
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          ref1 = c.split(':'), level = ref1[0], status = ref1[1];
          if (['on', 'marche'].indexOf(status) > -1) {
            current_startup += level;
          }
        }
      }
      if (options.startup === true && current_startup.length) {
        return callback();
      }
      if (options.startup === current_startup) {
        return callback();
      }
      if (registered && options.startup === false && current_startup === '') {
        return callback();
      }
      this.call({
        "if": options.startup
      }, function() {
        var cmd, i, k, startup_off, startup_on;
        cmd = "chkconfig --add " + options.name + ";";
        if (typeof options.startup === 'string') {
          startup_on = startup_off = '';
          for (i = k = 0; k < 6; i = ++k) {
            if (options.startup.indexOf(i) !== -1) {
              startup_on += i;
            } else {
              startup_off += i;
            }
          }
          if (startup_on) {
            cmd += "chkconfig --level " + startup_on + " " + options.name + " on;";
          }
          if (startup_off) {
            cmd += "chkconfig --level " + startup_off + " " + options.name + " off;";
          }
        } else {
          cmd += "chkconfig " + options.name + " on;";
        }
        return this.system.execute({
          cmd: cmd
        }, function(err) {
          return callback(err, true);
        });
      });
      return this.call({
        unless: options.startup
      }, function() {
        options.log({
          message: "Desactivating startup rules",
          level: 'DEBUG',
          module: 'mecano/lib/service/startup'
        });
        if (typeof options.log === "function") {
          options.log("Mecano `service.startup`: s");
        }
        return this.system.execute({
          cmd: "chkconfig " + options.name + " off"
        }, function(err) {
          return callback(err, true);
        });
      });
    });
  }, function(err, status) {
    var message;
    if (err) {
      throw err;
    }
    message = options.startup ? 'activated' : 'disabled';
    return options.log(status ? {
      message: "Service startup updated: " + message,
      level: 'WARN',
      module: 'nikita/lib/service/startup'
    } : {
      message: "Service startup not modified: " + message,
      level: 'INFO',
      module: 'nikita/lib/service/startup'
    });
  });
  return this.system.execute({
    "if": function() {
      return options.cmd === 'update-rc';
    },
    cmd: "startup=" + (options.startup ? '1' : '') + "\nif ls /etc/rc*.d/S??" + options.name + "; then\n  [ -z \"$startup\" ] || exit 3\n  echo 'Disable " + options.name + "'\n  update-rc.d -f " + options.name + " disable\nelse\n  [ -z \"$startup\" ] && exit 3\n  echo 'Enable " + options.name + "'\n  update-rc.d -f " + options.name + " enable\nfi",
    code_skipped: 3,
    arch_chroot: options.arch_chroot,
    rootdir: options.rootdir
  }, function(err, status) {
    var message;
    if (err) {
      throw err;
    }
    message = options.startup ? 'activated' : 'disabled';
    return options.log(status ? {
      message: "Service startup updated: " + message,
      level: 'WARN',
      module: 'nikita/lib/service/remove'
    } : {
      message: "Service startup not modified: " + message,
      level: 'INFO',
      module: 'nikita/lib/service/remove'
    });
  });
};
