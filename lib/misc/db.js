// Generated by CoffeeScript 1.12.4
var misc,
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports.escape = function(sql) {
  return sql.replace(/[\\"]/g, "\\$&");
};

module.exports.cmd = function() {
  var i, k, len, opt, options, opts, properties, v;
  opts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  properties = ['engine', 'cmd', 'admin_username', 'admin_password', 'username', 'password', 'host', 'database', 'silent'];
  options = {};
  for (i = 0, len = opts.length; i < len; i++) {
    opt = opts[i];
    if (typeof opt === 'string') {
      opt = {
        cmd: opt
      };
    }
    for (k in opt) {
      v = opt[k];
      if (indexOf.call(properties, k) < 0) {
        continue;
      }
      options[k] = v;
    }
  }
  options.engine = options.engine.toLowerCase();
  if (!options.admin_username) {
    options.admin_password = null;
  }
  if (options.silent == null) {
    options.silent = true;
  }
  if (!options.engine) {
    throw Error("Required Option: \"engine\"");
  }
  if (!options.host) {
    throw Error("Required Option: \"host\"");
  }
  if (!(options.admin_username || options.username)) {
    throw Error("Required Option: \"admin_username\" or \"username\"");
  }
  switch (options.engine) {
    case 'mysql':
      if (options.path == null) {
        options.path = 'mysql';
      }
      if (options.port == null) {
        options.port = '3306';
      }
      return ["mysql", "-h" + options.host, "-P" + options.port, "-u" + (options.admin_username || options.username), "-p'" + (options.admin_password || options.password) + "'", options.database ? "-D" + options.database : void 0, options.mysql_options ? "" + options.mysql_options : void 0, options.silent ? "-N -s -r" : void 0, options.cmd ? "-e \"" + (module.exports.escape(options.cmd)) + "\"" : void 0].join(' ');
    case 'postgres':
      if (options.path == null) {
        options.path = 'psql';
      }
      if (options.port == null) {
        options.port = '5432';
      }
      return ["PGPASSWORD=" + (options.admin_password || options.password), "psql", "-h " + options.host, "-p " + options.port, "-U " + (options.admin_username || options.username), options.database ? "-d " + options.database : void 0, options.postgres_options ? "" + options.postgres_options : void 0, "-tAq", options.cmd ? "-c \"" + options.cmd + "\"" : void 0].join(' ');
    default:
      throw Error("Unsupported engine: " + (JSON.stringify(options.engine)));
  }
};

module.exports.jdbc = function(jdbc) {
  var _, addresses, database, engine, ref, ref1;
  if (/^jdbc:mysql:/.test(jdbc)) {
    ref = /^jdbc:(.*?):\/+(.*?)\/(.*?)(\?(.*)|$)/.exec(jdbc), _ = ref[0], engine = ref[1], addresses = ref[2], database = ref[3];
    addresses = addresses.split(',').map(function(address) {
      var host, port, ref1;
      ref1 = address.split(':'), host = ref1[0], port = ref1[1];
      return {
        host: host,
        port: port || 3306
      };
    });
    return {
      engine: 'mysql',
      addresses: addresses,
      database: database
    };
  } else if (/^jdbc:postgresql:/.test(jdbc)) {
    ref1 = /^jdbc:(.*?):\/+(.*?)\/(.*?)(\?(.*)|$)/.exec(jdbc), _ = ref1[0], engine = ref1[1], addresses = ref1[2], database = ref1[3];
    addresses = addresses.split(',').map(function(address) {
      var host, port, ref2;
      ref2 = address.split(':'), host = ref2[0], port = ref2[1];
      return {
        host: host,
        port: port || 5432
      };
    });
    return {
      engine: 'postgres',
      addresses: addresses,
      database: database
    };
  } else {
    throw Error('Invalid JDBC URL');
  }
};

misc = require('.');
