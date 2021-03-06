// Generated by CoffeeScript 1.12.4
module.exports = function(options) {
  var k, ref, v;
  options.log({
    message: "Entering Docker service",
    level: 'DEBUG',
    module: 'nikita/lib/docker/service'
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
  if (options.detach == null) {
    options.detach = true;
  }
  if (options.rm == null) {
    options.rm = false;
  }
  if (!((options.name != null) || (options.container != null))) {
    throw Error('Missing container name');
  }
  return this.docker.run(options);
};
