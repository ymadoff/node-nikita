// Generated by CoffeeScript 1.12.4
var fs, path;

module.exports = function(options) {
  options.log({
    message: "Entering service.init",
    level: 'DEBUG',
    module: 'nikita/lib/service/init'
  });
  if (options.source == null) {
    throw Error('Missing source');
  }
  if (options.engine == null) {
    options.engine = 'nunjunks';
  }
  if (options.mode == null) {
    options.mode = 0x1ed;
  }
  if (options.name == null) {
    options.name = path.basename(options.source).split('.')[0];
  }
  if (options.target == null) {
    options.target = "/etc/init.d/" + options.name;
  }
  return this.service.discover(function(err, status, loader) {
    if (options.loader == null) {
      options.loader = loader;
    }
    this.file.render({
      target: options.target,
      source: options.source,
      mode: options.mode,
      uid: options.uid,
      gid: options.gid,
      backup: options.backup,
      context: options.context,
      local: options.local
    });
    this.system.execute({
      "if": function() {
        return (options.loader === 'systemctl') && (path.dirname(options.target) === '/etc/init.d');
      },
      shy: true,
      cmd: "systemctl status " + options.name + " 2>\&1 | egrep '(Reason: No such file or directory)|(Unit " + options.name + ".service could not be found)'",
      code_skipped: 1
    });
    return this.system.execute({
      "if": function() {
        return this.status(-1);
      },
      cmd: 'systemctl daemon-reload'
    });
  });
};

fs = require('ssh2-fs');

path = require('path');
