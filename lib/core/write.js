// Generated by CoffeeScript 1.10.0
var diff, eco, fs, misc, nunjucks, path, quote, string, uid_gid;

module.exports = function(options, callback) {
  var append, between, content, destination, destinationHash, destinationStat, do_backup, do_chown_chmod, do_diff, do_end, do_eof, do_read_destination, do_read_source, do_render, do_replace_partial, do_skip_empty_lines, do_write, from, j, len, modified, to, w, write;
  modified = false;
  if (!((options.source || (options.content != null)) || options.replace || (options.write != null))) {
    return callback(Error('Missing source or content'));
  }
  if (options.source && options.content) {
    return callback(Error('Define either source or content'));
  }
  if (!options.destination) {
    return callback(Error('Missing destination'));
  }
  options.log({
    message: "Source is \"" + options.source + "\"",
    level: 'DEBUG',
    module: 'mecano/src/write'
  });
  options.log({
    message: "Destination is \"" + options.destination + "\"",
    level: 'DEBUG',
    module: 'mecano/src/write'
  });
  if (options.content && Buffer.isBuffer(options.content)) {
    options.content = options.content.toString();
  }
  if (options.diff == null) {
    options.diff = options.diff || !!options.stdout;
  }
  if (options.engine == null) {
    options.engine = 'nunjunks';
  }
  if (options.unlink == null) {
    options.unlink = false;
  }
  switch (options.eof) {
    case 'unix':
      options.eof = "\n";
      break;
    case 'mac':
      options.eof = "\r";
      break;
    case 'windows':
      options.eof = "\r\n";
      break;
    case 'unicode':
      options.eof = "\u2028";
  }
  destination = null;
  destinationHash = null;
  content = null;
  from = to = between = null;
  append = options.append;
  write = options.write;
  if (write == null) {
    write = [];
  }
  if ((options.from != null) || (options.to != null) || (options.match != null) || (options.replace != null) || (options.before != null)) {
    write.push({
      from: options.from,
      to: options.to,
      match: options.match,
      replace: options.replace,
      append: options.append,
      before: options.before
    });
  }
  for (j = 0, len = write.length; j < len; j++) {
    w = write[j];
    if ((w.from == null) && (w.to == null) && (w.match == null) && (w.replace != null)) {
      w.match = w.replace;
    }
  }
  do_read_source = function() {
    var source, ssh;
    if (options.content != null) {
      content = options.content;
      if (typeof content === 'number') {
        content = "" + content;
      }
      return do_read_destination();
    }
    source = options.source || options.destination;
    options.log({
      message: "Force local source is \"" + (options.local_source ? 'true' : 'false') + "\"",
      level: 'DEBUG',
      module: 'mecano/src/write'
    });
    ssh = options.local_source ? null : options.ssh;
    return fs.exists(ssh, source, function(err, exists) {
      if (err) {
        return callback(err);
      }
      if (!exists) {
        if (options.source) {
          return callback(new Error("Source does not exist: " + (JSON.stringify(options.source))));
        }
        content = '';
        return do_read_destination();
      }
      options.log({
        message: "Reading source",
        level: 'DEBUG',
        module: 'mecano/src/write'
      });
      return fs.readFile(ssh, source, 'utf8', function(err, src) {
        if (err) {
          return callback(err);
        }
        content = src;
        return do_read_destination();
      });
    });
  };
  destinationStat = null;
  do_read_destination = (function(_this) {
    return function() {
      var do_mkdir, do_read, exists;
      if (typeof options.destination === 'function') {
        return do_render();
      }
      exists = function() {
        options.log({
          message: "Stat destination",
          level: 'DEBUG',
          module: 'mecano/src/write'
        });
        return fs.lstat(options.ssh, options.destination, function(err, stat) {
          if ((err != null ? err.code : void 0) === 'ENOENT') {
            return do_mkdir();
          }
          if (err) {
            return callback(err);
          }
          destinationStat = stat;
          if (stat.isDirectory()) {
            options.destination = options.destination + "/" + (path.basename(options.source));
            options.log({
              message: "Destination is a directory and is now \"options.destination\"",
              level: 'INFO',
              module: 'mecano/src/write'
            });
            return fs.stat(options.ssh, options.destination, function(err, stat) {
              if ((err != null ? err.code : void 0) === 'ENOENT') {
                options.log({
                  message: "New destination does not exist",
                  level: 'INFO',
                  module: 'mecano/src/write'
                });
                return do_render();
              }
              if (err) {
                return callback(err);
              }
              if (!stat.isFile()) {
                return callback(new Error("Destination is not a file: " + options.destination));
              }
              options.log({
                message: "New destination exist",
                level: 'INFO',
                module: 'mecano/src/write'
              });
              destinationStat = stat;
              return do_read();
            });
          } else if (stat.isSymbolicLink()) {
            options.log({
              message: "Destination is a symlink",
              level: 'INFO',
              module: 'mecano/src/write'
            });
            if (!options.unlink) {
              return do_read();
            }
            return fs.unlink(options.ssh, options.destination, function(err, stat) {
              if (err) {
                return callback(err);
              }
              return do_render();
            });
          } else if (stat.isFile()) {
            options.log({
              message: "Destination is a file",
              level: 'INFO',
              module: 'mecano/src/write'
            });
            return do_read();
          } else {
            return callback(Error("Invalid File Type Destination"));
          }
        });
      };
      do_mkdir = function() {
        return _this.mkdir({
          destination: path.dirname(options.destination),
          uid: options.uid,
          gid: options.gid,
          mode: options.mode,
          unless_exists: path.dirname(options.destination)
        }, function(err, created) {
          if (err) {
            return callback(err);
          }
          return do_render();
        });
      };
      do_read = function() {
        options.log({
          message: "Reading destination",
          level: 'DEBUG',
          module: 'mecano/src/write'
        });
        return fs.readFile(options.ssh, options.destination, 'utf8', function(err, dest) {
          if (err) {
            return callback(err);
          }
          if (options.diff) {
            destination = dest;
          }
          destinationHash = string.hash(dest);
          return do_render();
        });
      };
      return exists();
    };
  })(this);
  do_render = function() {
    var base, base1, engine, err, error, filter, func, ref;
    if (options.context == null) {
      return do_skip_empty_lines();
    }
    options.log({
      message: "Rendering with " + options.engine,
      level: 'DEBUG',
      module: 'mecano/src/write'
    });
    try {
      switch (options.engine) {
        case 'nunjunks':
          engine = new nunjucks.Environment(null, {
            autoescape: false
          });
          if (options.filters == null) {
            options.filters = {};
          }
          if ((base = options.filters).isString == null) {
            base.isString = function(obj) {
              return typeof obj === 'string';
            };
          }
          if ((base1 = options.filters).isArray == null) {
            base1.isArray = function(obj) {
              return Array.isArray(obj);
            };
          }
          ref = options.filters;
          for (filter in ref) {
            func = ref[filter];
            if (typeof func === 'function') {
              engine.addFilter(filter, func);
            } else {
              options.log({
                message: "Option filter not a function and ignored",
                level: 'WARN',
                module: 'mecano/src/write'
              });
            }
          }
          content = engine.renderString(content.toString(), options.context);
          break;
        case 'eco':
          content = eco.render(content.toString(), options.context);
          break;
        default:
          return callback(Error("Invalid engine: " + options.engine));
      }
    } catch (error) {
      err = error;
      return callback(typeof err === 'string' ? Error(err) : err);
    }
    return do_skip_empty_lines();
  };
  do_skip_empty_lines = function() {
    if (options.skip_empty_lines == null) {
      return do_replace_partial();
    }
    options.log({
      message: "Skip empty lines",
      level: 'DEBUG',
      module: 'mecano/src/write'
    });
    content = content.replace(/(\r\n|[\n\r\u0085\u2028\u2029])\s*(\r\n|[\n\r\u0085\u2028\u2029])/g, "$1");
    return do_replace_partial();
  };
  do_replace_partial = function() {
    var before, from_index, k, len1, linebreak, opts, orgContent, pos, posoffset, res;
    if (!write.length) {
      return do_eof();
    }
    options.log({
      message: "Replacing sections of the file",
      level: 'DEBUG',
      module: 'mecano/src/write'
    });
    for (k = 0, len1 = write.length; k < len1; k++) {
      opts = write[k];
      if (opts.match) {
        if (opts.match == null) {
          opts.match = opts.replace;
        }
        if (typeof opts.match === 'string') {
          opts.match = RegExp("" + (quote(opts.match)), "mg");
        }
        if (!(opts.match instanceof RegExp)) {
          return callback(Error("Invalid match option"));
        }
        if (opts.match.test(content)) {
          content = content.replace(opts.match, opts.replace);
          append = false;
        } else if (opts.before && typeof opts.replace === 'string') {
          if (typeof opts.before === "string") {
            opts.before = new RegExp(RegExp("^.*" + (quote(opts.before)) + ".*$", "mg"));
          }
          if (opts.before instanceof RegExp) {
            posoffset = 0;
            orgContent = content;
            while ((res = opts.before.exec(orgContent)) !== null) {
              pos = posoffset + res.index;
              content = content.slice(0, pos) + opts.replace + '\n' + content.slice(pos);
              posoffset += opts.replace.length + 1;
              if (!opts.before.global) {
                break;
              }
            }
            before = false;
          } else {
            linebreak = content.length === 0 || content.substr(content.length - 1) === '\n' ? '' : '\n';
            content = opts.replace + linebreak + content;
            append = false;
          }
        } else if (opts.append && typeof opts.replace === 'string') {
          if (typeof opts.append === "string") {
            opts.append = new RegExp("^.*" + (quote(opts.append)) + ".*$", 'mg');
          }
          if (opts.append instanceof RegExp) {
            posoffset = 0;
            orgContent = content;
            while ((res = opts.append.exec(orgContent)) !== null) {
              pos = posoffset + res.index + res[0].length;
              content = content.slice(0, pos) + '\n' + opts.replace + content.slice(pos);
              posoffset += opts.replace.length + 1;
              if (!opts.append.global) {
                break;
              }
            }
            append = false;
          } else {
            linebreak = content.length === 0 || content.substr(content.length - 1) === '\n' ? '' : '\n';
            content = content + linebreak + opts.replace;
            append = false;
          }
        } else {
          continue;
        }
      } else if (opts.before === true) {

      } else if (opts.from || opts.to) {
        if (opts.from && opts.to) {
          from = RegExp("(^" + (quote(opts.from)) + "$)", "m").exec(content);
          to = RegExp("(^" + (quote(opts.to)) + "$)", "m").exec(content);
          if ((from != null) && (to == null)) {
            options.log({
              message: "Found 'from' but missing 'to', skip writing",
              level: 'WARN',
              module: 'mecano/src/write'
            });
          } else if ((from == null) && (to != null)) {
            options.log({
              message: "Missing 'from' but found 'to', skip writing",
              level: 'WARN',
              module: 'mecano/src/write'
            });
          } else if ((from == null) && (to == null)) {
            if (opts.append) {
              content += '\n' + opts.from + '\n' + opts.replace + '\n' + opts.to;
              append = false;
            } else {
              options.log({
                message: "Missing 'from' and 'to' without append, skip writing",
                level: 'WARN',
                module: 'mecano/src/write'
              });
            }
          } else {
            content = content.substr(0, from.index + from[1].length + 1) + opts.replace + '\n' + content.substr(to.index);
            append = false;
          }
        } else if (opts.from && !opts.to) {
          from = RegExp("(^" + (quote(opts.from)) + "$)", "m").exec(content);
          if (from != null) {
            content = content.substr(0, from.index + from[1].length) + '\n' + opts.replace;
          } else {
            options.log({
              message: "Missing 'from', skip writing",
              level: 'WARN',
              module: 'mecano/src/write'
            });
          }
        } else if (!opts.from && opts.to) {
          from_index = 0;
          to = RegExp("(^" + (quote(opts.to)) + "$)", "m").exec(content);
          if (to != null) {
            content = opts.replace + '\n' + content.substr(to.index);
          } else {
            options.log({
              message: "Missing 'to', skip writing",
              level: 'WARN',
              module: 'mecano/src/write'
            });
          }
        }
      }
    }
    return do_eof();
  };
  do_eof = function() {
    var char, i, k, len1;
    if (options.eof == null) {
      return do_diff();
    }
    options.log({
      message: "Checking option eof",
      level: 'DEBUG',
      module: 'mecano/src/write'
    });
    if (options.eof === true) {
      for (i = k = 0, len1 = content.length; k < len1; i = ++k) {
        char = content[i];
        if (char === '\r') {
          options.eof = content[i + 1] === '\n' ? '\r\n' : char;
          break;
        }
        if (char === '\n' || char === '\u2028') {
          options.eof = char;
          break;
        }
      }
      if (options.eof === true) {
        options.eof = '\n';
      }
      options.log({
        message: "Option eof is true, gessing as " + (JSON.stringify(options.eof)),
        level: 'INFO',
        module: 'mecano/src/write'
      });
    }
    if (!string.endsWith(content, options.eof)) {
      options.log({
        message: "Add eof",
        level: 'WARN',
        module: 'mecano/src/write'
      });
      content += options.eof;
    }
    return do_diff();
  };
  do_diff = function() {
    if (destinationHash === string.hash(content)) {
      return do_chown_chmod();
    }
    options.log({
      message: "File content has changed",
      level: 'WARN',
      module: 'mecano/src/write'
    });
    diff(content, destination, options);
    return do_backup();
  };
  do_backup = (function(_this) {
    return function() {
      var backup;
      if (!(options.backup && destinationHash)) {
        return do_write();
      }
      options.log({
        message: "Create backup",
        level: 'INFO',
        module: 'mecano/src/write'
      });
      backup = typeof options.backup === 'string' ? options.backup : "." + (Date.now());
      return _this.copy({
        ssh: options.ssh,
        source: options.destination,
        destination: "" + options.destination + backup
      }, function(err) {
        if (err) {
          return callback(err);
        }
        return do_write();
      });
    };
  })(this);
  do_write = function() {
    if (typeof options.destination === 'function') {
      options.log({
        message: "Write destination with user function",
        level: 'INFO',
        module: 'mecano/src/write'
      });
      options.destination(content);
      return do_end();
    } else {
      options.log({
        message: "Write destination",
        level: 'INFO',
        module: 'mecano/src/write'
      });
      if (append) {
        if (options.flags == null) {
          options.flags = 'a';
        }
      }
      return uid_gid(options, function(err) {
        if (err) {
          return callback(err);
        }
        return fs.writeFile(options.ssh, options.destination, content, options, function(err) {
          if (err) {
            return callback(err);
          }
          options.log({
            message: "File written",
            level: 'INFO',
            module: 'mecano/src/write'
          });
          modified = true;
          return do_end();
        });
      });
    }
  };
  do_chown_chmod = (function(_this) {
    return function() {
      _this.chown({
        destination: options.destination,
        stat: destinationStat,
        uid: options.uid,
        gid: options.gid,
        "if": (options.uid != null) || (options.gid != null)
      });
      _this.chmod({
        destination: options.destination,
        stat: destinationStat,
        mode: options.mode,
        "if": options.mode != null
      });
      return _this.then(function(err, status) {
        if (err) {
          return callback(err);
        }
        if (status) {
          modified = true;
        }
        return do_end();
      });
    };
  })(this);
  do_end = function() {
    return callback(null, modified);
  };
  return do_read_source();
};

fs = require('ssh2-fs');

path = require('path');

eco = require('eco');

nunjucks = require('nunjucks/src/environment');

quote = require('regexp-quote');

misc = require('../misc');

diff = require('../misc/diff');

string = require('../misc/string');

uid_gid = require('../misc/uid_gid');