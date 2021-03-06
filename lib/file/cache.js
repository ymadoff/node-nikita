// Generated by CoffeeScript 1.12.4
var curl, file, path, protocols_ftp, protocols_http, ssh2fs, url,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports = function(options, callback) {
  var algo, cmd, fail, hash, header, i, k, len, ref, ref1, ref2, ref3, ref4, u;
  options.log({
    message: "Entering file.cache",
    level: 'DEBUG',
    module: 'nikita/lib/file/cache'
  });
  if (options.argument != null) {
    options.source = options.argument;
  }
  if (!options.source) {
    return callback(Error("Missing source: '" + options.source + "'"));
  }
  if (!(options.cache_file || options.target || options.cache_dir)) {
    return callback(Error("Missing one of 'target', 'cache_file' or 'cache_dir' option"));
  }
  if (options.target == null) {
    options.target = options.cache_file;
  }
  if (options.target == null) {
    options.target = path.basename(options.source);
  }
  options.target = path.resolve(options.cache_dir, options.target);
  if (/^file:\/\//.test(options.source)) {
    options.source = options.source.substr(7);
  }
  if (options.headers == null) {
    options.headers = [];
  }
  if (options.md5 != null) {
    if ((ref = typeof options.md5) !== 'string' && ref !== 'boolean') {
      return callback(new Error("Invalid MD5 Hash:" + options.md5));
    }
    algo = 'md5';
    hash = options.md5;
  } else if (options.sha1 != null) {
    if ((ref1 = typeof options.sha1) !== 'string' && ref1 !== 'boolean') {
      return callback(new Error("Invalid SHA-1 Hash:" + options.sha1));
    }
    algo = 'sha1';
    hash = options.sha1;
  } else if (options.sha256 != null) {
    if ((ref2 = typeof options.sha256) !== 'string' && ref2 !== 'boolean') {
      return callback(new Error("Invalid SHA-1 Hash:" + options.sha256));
    }
    algo = 'sha256';
    hash = options.sha256;
  } else {
    algo = 'md5';
    hash = false;
  }
  u = url.parse(options.source);
  this.call({
    handler: function(_, callback) {
      if (u.protocol !== null) {
        options.log({
          message: "Bypass source hash computation for non-file protocols",
          level: 'WARN',
          module: 'nikita/lib/file/cache'
        });
        return callback();
      }
      if (hash !== true) {
        return callback();
      }
      return file.hash(options.ssh, options.source, algo, function(err, value) {
        if (err) {
          return callback(err);
        }
        options.log({
          message: "Computed hash value is '" + value + "'",
          level: 'INFO',
          module: 'nikita/lib/file/cache'
        });
        hash = value;
        return callback();
      });
    }
  });
  this.call({
    shy: true,
    handler: function(_, callback) {
      options.log({
        message: "Check if target (" + options.target + ") exists",
        level: 'DEBUG',
        module: 'nikita/lib/file/cache'
      });
      return ssh2fs.exists(options.ssh, options.target, (function(_this) {
        return function(err, exists) {
          if (err) {
            return callback(err);
          }
          if (exists) {
            options.log({
              message: "Target file exists",
              level: 'INFO',
              module: 'nikita/lib/file/cache'
            });
            if (options.force) {
              options.log({
                message: "Force mode, cache will be overwritten",
                level: 'DEBUG',
                module: 'nikita/lib/file/cache'
              });
              return callback(null, true);
            } else if (hash && typeof hash === 'string') {
              options.log({
                message: "Comparing " + algo + " hash",
                level: 'DEBUG',
                module: 'nikita/lib/file/cache'
              });
              return file.hash(options.ssh, options.target, algo, function(err, c_hash) {
                if (err) {
                  return callback(err);
                }
                if (hash === c_hash) {
                  options.log({
                    message: "Hashes match, skipping",
                    level: 'DEBUG',
                    module: 'nikita/lib/file/cache'
                  });
                  return callback(null, false);
                }
                options.log({
                  message: "Hashes don't match, delete then re-download",
                  level: 'WARN',
                  module: 'nikita/lib/file/cache'
                });
                return ssh2fs.unlink(options.ssh, options.target, function(err) {
                  if (err) {
                    return callback(err);
                  }
                  return callback(null, true);
                });
              });
            } else {
              options.log({
                message: "Target file exists, check disabled, skipping",
                level: 'DEBUG',
                module: 'nikita/lib/file/cache'
              });
              return callback(null, false);
            }
          } else {
            options.log({
              message: "Target file does not exists",
              level: 'INFO',
              module: 'nikita/lib/file/cache'
            });
            return callback(null, true);
          }
        };
      })(this));
    }
  }, function(err, status) {
    if (!status) {
      return this.end();
    }
  });
  if (ref3 = u.protocol, indexOf.call(protocols_http, ref3) >= 0) {
    fail = options.fail ? "--fail" : '';
    k = u.protocol === 'https:' ? '-k' : '';
    cmd = "curl " + fail + " " + k + " -s " + options.source + " -o " + options.target;
    if (options.location) {
      cmd += " --location";
    }
    ref4 = options.headers;
    for (i = 0, len = ref4.length; i < len; i++) {
      header = ref4[i];
      cmd += " --header \"" + header + "\"";
    }
    if (options.proxy) {
      cmd += " -x " + options.proxy;
    }
    this.system.mkdir({
      ssh: options.cache_local ? null : options.ssh,
      target: path.dirname(options.target)
    });
    this.system.execute({
      cmd: cmd,
      ssh: options.cache_local ? null : options.ssh,
      unless_exists: options.target
    });
  } else {
    this.system.mkdir({
      target: "" + (path.dirname(options.target))
    });
    this.system.copy({
      source: "" + options.source,
      target: "" + options.target
    });
  }
  return this.then(function(err, status) {
    return callback(err, status, options.target);
  });
};

module.exports.protocols_http = protocols_http = ['http:', 'https:'];

module.exports.protocols_ftp = protocols_ftp = ['ftp:', 'ftps:'];

path = require('path');

url = require('url');

ssh2fs = require('ssh2-fs');

curl = require('../misc/curl');

file = require('../misc/file');
