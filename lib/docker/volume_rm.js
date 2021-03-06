// Generated by CoffeeScript 1.12.4
var docker;

module.exports = function(options) {
  options.log({
    message: "Entering Docker volume_rm",
    level: 'DEBUG',
    module: 'nikita/lib/docker/volume_rm'
  });
  if (!options.name) {
    throw Error("Missing required option name");
  }
  return this.system.execute({
    cmd: docker.wrap(options, "volume rm " + options.name),
    code: 0,
    code_skipped: 1
  });
};

docker = require('../misc/docker');
