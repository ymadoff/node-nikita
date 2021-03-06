// Generated by CoffeeScript 1.12.4
var log_fs;

module.exports = {
  ssh: null,
  handler: function(options) {
    var stdouting;
    stdouting = 0;
    if (options.divider == null) {
      options.divider = ' : ';
    }
    return this.call(options, log_fs, {
      serializer: {
        'diff': function(log) {
          if (!log.message) {
            return "\n```diff\n" + log.message + "```\n\n";
          }
        },
        'end': function() {
          return '\nFINISHED WITH SUCCESS\n';
        },
        'error': function(err) {
          var content, error, i, len, print, ref;
          content = [];
          content.push('\nFINISHED WITH ERROR\n');
          print = function(err) {
            return content.push(err.stack || err.message + '\n');
          };
          if (!err.errors) {
            print(err);
          } else if (err.errors) {
            content.push(err.message + '\n');
            ref = err.errors;
            for (i = 0, len = ref.length; i < len; i++) {
              error = ref[i];
              content.push(error);
            }
          }
          return content.join('');
        },
        'header': function(log) {
          var header;
          header = log.headers.join(options.divider);
          return "\n" + ('#'.repeat(log.headers.length)) + " " + header + "\n\n";
        },
        'stdin': function(log) {
          var out;
          out = [];
          if (log.message.indexOf('\n') === -1) {
            out.push("\nRunning Command: `" + log.message + "`\n\n");
          } else {
            out.push("\n```stdin\n" + log.message + "\n```\n\n");
          }
          return out.join('');
        },
        'stderr': function(log) {
          return "\n```stderr\n" + log.message + "```\n\n";
        },
        'stdout_stream': function(log) {
          var out;
          if (log.message === null) {
            stdouting = 0;
          } else {
            stdouting++;
          }
          out = [];
          if (stdouting === 1) {
            out.push('\n```stdout\n');
          }
          if (stdouting > 0) {
            out.push(log.message);
          }
          if (stdouting === 0) {
            out.push('\n```\n\n');
          }
          return out.join('');
        },
        'text': function(log) {
          var content;
          content = [];
          content.push("" + log.message);
          if (log.module) {
            content.push(" (" + log.level + ", written by " + log.module + ")");
          }
          content.push("\n");
          return content.join('');
        }
      }
    });
  }
};

log_fs = require('./fs');
