// Generated by CoffeeScript 1.9.1
var each, exec, misc, wrap;

module.exports = function(options, callback) {
  var stds;
  stds = callback.length > 2 || options.user_args;
  return wrap(this, arguments, function(options, callback) {
    var child, stderr, stdout;
    if (typeof options === 'string') {
      options = {
        cmd: options
      };
    }
    if (options.cmd == null) {
      return callback(new Error("Missing cmd: " + options.cmd));
    }
    if (options.code == null) {
      options.code = [0];
    }
    if (!Array.isArray(options.code)) {
      options.code = [options.code];
    }
    if (options.code_skipped == null) {
      options.code_skipped = [];
    }
    if (!Array.isArray(options.code_skipped)) {
      options.code_skipped = [options.code_skipped];
    }
    if (options.trap_on_error) {
      options.cmd = "set -e\n" + options.cmd;
    }
    if (typeof options.log === "function") {
      options.log("Mecano `execute`: " + options.cmd + " [INFO]");
    }
    child = exec(options);
    stdout = [];
    stderr = [];
    if (options.stdout) {
      child.stdout.pipe(options.stdout, {
        end: false
      });
    }
    if (options.stderr) {
      child.stderr.pipe(options.stderr, {
        end: false
      });
    }
    if (stds) {
      child.stdout.on('data', function(data) {
        if (Array.isArray(stdout)) {
          return stdout.push(data);
        } else {
          return console.log('stdout coming after child exit');
        }
      });
      child.stderr.on('data', function(data) {
        if (Array.isArray(stderr)) {
          return stderr.push(data);
        } else {
          return console.log('stderr coming after child exit');
        }
      });
    }
    return child.on("exit", function(code) {
      return setTimeout(function() {
        var err, executed;
        stdout = stds ? stdout.join('') : void 0;
        stderr = stds ? stderr.join('') : void 0;
        if (options.stdout) {
          child.stdout.unpipe(options.stdout);
        }
        if (options.stderr) {
          child.stderr.unpipe(options.stderr);
        }
        if (options.code.indexOf(code) === -1 && options.code_skipped.indexOf(code) === -1) {
          if (typeof options.log === "function") {
            options.log("Mecano `execute`: invalid exit code \"" + code + "\"");
          }
          err = new Error("Invalid Exit Code: " + code);
          err.code = code;
          return callback(err, null, stdout, stderr);
        }
        if (options.code_skipped.indexOf(code) === -1) {
          executed = true;
        } else {
          if (typeof options.log === "function") {
            options.log("Mecano `execute`: skip exit code \"" + code + "\"");
          }
        }
        return callback(null, executed, stdout, stderr);
      }, 1);
    });
  });
};

each = require('each');

exec = require('ssh2-exec');

misc = require('./misc');

wrap = require('./misc/wrap');