// Generated by CoffeeScript 1.12.4
var uid_gid;

module.exports = function(options) {
  var info, modified;
  options.log({
    message: "Entering group",
    level: 'DEBUG',
    module: 'nikita/lib/system/group'
  });
  if (options.argument != null) {
    options.name = options.argument;
  }
  if (!options.name) {
    throw Error("Option 'name' is required");
  }
  if (options.system == null) {
    options.system = false;
  }
  if (options.gid == null) {
    options.gid = null;
  }
  modified = false;
  info = null;
  this.call(function(_, callback) {
    options.log({
      message: "Get group information for '" + options.name + "'",
      level: 'DEBUG',
      module: 'nikita/lib/system/group'
    });
    options.store.cache_group = void 0;
    return uid_gid.group(options.ssh, options.store, function(err, groups) {
      if (err) {
        return callback(err);
      }
      info = groups[options.name];
      options.log({
        message: "Got " + (JSON.stringify(info)),
        level: 'INFO',
        module: 'nikita/lib/system/group'
      });
      return callback();
    });
  });
  this.call({
    unless: (function() {
      return info;
    })
  }, function() {
    var cmd;
    cmd = 'groupadd';
    if (options.system) {
      cmd += " -r";
    }
    if (options.gid) {
      cmd += " -g " + options.gid;
    }
    cmd += " " + options.name;
    return this.system.execute({
      cmd: cmd,
      code_skipped: 9
    }, function(err, status) {
      if (err) {
        throw err;
      }
      if (!status) {
        return options.log({
          message: "Group defined elsewhere than '/etc/group', exit code is 9",
          level: 'WARN',
          module: 'nikita/lib/system/group'
        });
      }
    });
  });
  return this.call({
    "if": (function() {
      return info;
    })
  }, function() {
    var changed, cmd, i, k, len, ref;
    changed = [];
    ref = ['gid'];
    for (i = 0, len = ref.length; i < len; i++) {
      k = ref[i];
      if ((options[k] != null) && info[k] !== options[k]) {
        changed.push('gid');
      }
    }
    options.log(changed.length ? {
      message: "Group information modified",
      level: 'WARN',
      module: 'nikita/lib/system/group'
    } : {
      message: "Group information unchanged",
      level: 'DEBUG',
      module: 'nikita/lib/system/group'
    });
    if (!changed.length) {
      return;
    }
    cmd = 'groupmod';
    if (options.gid) {
      cmd += " -g " + options.gid;
    }
    cmd += " " + options.name;
    return this.system.execute({
      cmd: cmd,
      "if": changed.length
    });
  });
};

uid_gid = require('../../misc/uid_gid');
