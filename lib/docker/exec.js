// Generated by CoffeeScript 1.12.4
var docker,
  slice = [].slice;

module.exports = function(options, callback) {
  var cmd, k, ref, v;
  options.log({
    message: "Entering Docker exec",
    level: 'DEBUG',
    module: 'nikita/lib/docker/exec'
  });
  if (options.docker == null) {
    options.docker = {};
  }
  ref = options.docker;
  for (k in ref) {
    v = ref[k];
    if (options[k] == null) {
      options[k] = v;
    }
  }
  if (options.container == null) {
    throw Error('Missing container');
  }
  if (options.cmd == null) {
    throw Error('Missing cmd');
  }
  if (options.service == null) {
    options.service = false;
  }
  cmd = 'exec';
  if (options.uid != null) {
    cmd += " -u " + options.uid;
    if (options.gid != null) {
      cmd += ":" + options.gid;
    }
  } else if (options.gid != null) {
    options.log({
      message: 'options.gid ignored unless options.uid is provided',
      level: 'WARN',
      module: 'nikita/lib/docker/exec'
    });
  }
  cmd += " " + options.container + " " + options.cmd;
  delete options.cmd;
  return this.system.execute({
    cmd: docker.wrap(options, cmd),
    code_skipped: options.code_skipped
  }, function() {
    var e, ref1;
    try {
      (ref1 = docker.callback).call.apply(ref1, [null].concat(slice.call(arguments)));
    } catch (error) {
      e = error;
      arguments[0] = e;
    }
    return callback.apply(null, arguments);
  });
};

docker = require('../misc/docker');
