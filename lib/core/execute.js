// Generated by CoffeeScript 1.10.0
var exec, misc;

module.exports = function(options, callback) {
  var child, stderr, stdout, stds;
  stds = options.user_args;
  if (typeof options.argument === 'string') {
    options.cmd = options.argument;
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
  options.log({
    message: options.cmd,
    type: 'stdin'
  });
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
  if (child.stdout || child.stdout === void 0) {
    child.stdout.on('data', function(data) {
      return options.log({
        message: data,
        type: 'stdout'
      });
    });
    child.stdout.on('end', function(data) {
      return options.log({
        message: null,
        type: 'stdout'
      });
    });
    child.stderr.on('data', function(data) {
      return options.log({
        message: data,
        type: 'stderr'
      });
    });
    child.stderr.on('end', function(data) {
      return options.log({
        message: null,
        type: 'stderr'
      });
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
        err = new Error("Invalid Exit Code: " + code);
        err.code = code;
        return callback(err, null, stdout, stderr);
      }
      if (options.code_skipped.indexOf(code) === -1) {
        executed = true;
      } else {
        options.log({
          message: "Skip exit code \"" + code + "\"",
          level: 'INFO',
          module: 'mecano/src/execute'
        });
      }
      return callback(null, executed, stdout, stderr);
    }, 1);
  });
};

exec = require('ssh2-exec');

misc = require('../misc');