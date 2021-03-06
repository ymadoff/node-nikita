// Generated by CoffeeScript 1.12.4
var docker, util;

module.exports = function(options, callback) {
  var cmd, cmd_images, k, ref, v;
  options.log({
    message: "Entering Docker pull",
    level: 'DEBUG',
    module: 'nikita/lib/docker/pull'
  });
  if (options.docker == null) {
    options.docker = {};
  }
  if (options.version == null) {
    options.version = 'latest';
  }
  if (options.all == null) {
    options.all = false;
  }
  ref = options.docker;
  for (k in ref) {
    v = ref[k];
    if (options[k] == null) {
      options[k] = v;
    }
  }
  cmd_images = 'images';
  cmd_images += " | grep '" + options.tag + "'";
  if (!options.all) {
    cmd_images += " | grep '" + options.version + "'";
  }
  if (options.tag == null) {
    throw Error('Missing Tag Name');
  }
  cmd = 'pull';
  cmd += options.all ? " -a " + options.tag : " " + options.tag + ":" + options.version;
  this.system.execute({
    cmd: docker.wrap(options, cmd_images),
    code_skipped: 1
  });
  return this.system.execute({
    unless: function() {
      return this.status(-1);
    },
    cmd: docker.wrap(options, cmd),
    code_skipped: options.code_skipped
  }, function(err, status) {
    return callback(err, status);
  });
};

docker = require('../misc/docker');

util = require('util');
