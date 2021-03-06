// Generated by CoffeeScript 1.12.4
var docker, util;

module.exports = function(options) {
  var cmd_images, cmd_rmi, i, k, len, opt, ref, ref1, v;
  options.log({
    message: "Entering Docker rmi",
    level: 'DEBUG',
    module: 'nikita/lib/docker/rmi'
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
  if (options.image == null) {
    throw Error('Missing image parameter');
  }
  cmd_images = 'images';
  cmd_images += " | grep '" + options.image + " '";
  if (options.tag != null) {
    cmd_images += " | grep ' " + options.tag + " '";
  }
  cmd_rmi = 'rmi';
  ref1 = ['force', 'no_prune'];
  for (i = 0, len = ref1.length; i < len; i++) {
    opt = ref1[i];
    if (options[opt] != null) {
      cmd_rmi += " --" + (opt.replace('_', '-'));
    }
  }
  cmd_rmi += " " + options.image;
  if (options.tag != null) {
    cmd_rmi += ":" + options.tag;
  }
  this.system.execute({
    cmd: docker.wrap(options, cmd_images),
    code_skipped: 1
  }, docker.callback);
  return this.system.execute({
    cmd: docker.wrap(options, cmd_rmi),
    "if": function() {
      return this.status(-1);
    }
  }, docker.callback);
};

docker = require('../misc/docker');

util = require('util');
