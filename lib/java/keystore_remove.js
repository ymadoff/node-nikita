// Generated by CoffeeScript 1.12.4
var slice = [].slice;

module.exports = function(options) {
  var aliases;
  if (!options.keystore) {
    throw Error("Required option 'keystore'");
  }
  if (!options.storepass) {
    throw Error("Required option 'storepass'");
  }
  if (!(options.name || options.caname)) {
    throw Error("Required option 'name' or 'caname'");
  }
  if (!Array.isArray(options.caname)) {
    options.caname = [options.caname];
  }
  if (!Array.isArray(options.name)) {
    options.name = [options.name];
  }
  aliases = slice.call(options.caname).concat(slice.call(options.name)).join(' ').trim();
  return this.system.execute({
    bash: true,
    cmd: "test -f \"" + options.keystore + "\" || # Nothing to do if not a file\nexit 3\ncount=0\nfor alias in " + aliases + "; do\n  if keytool -list -keystore \"" + options.keystore + "\" -storepass \"" + options.storepass + "\" -alias \"$alias\"; then\n     keytool -delete -keystore \"" + options.keystore + "\" -storepass \"" + options.storepass + "\" -alias \"$alias\"\n     (( count++ ))\n  fi\ndone\n[ $count -eq 0 ] && exit 3\nexit 0",
    code_skipped: 3
  });
};
