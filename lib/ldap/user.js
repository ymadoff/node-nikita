// Generated by CoffeeScript 1.12.4
var each;

module.exports = function(options, callback) {
  var binddn, modified, passwd, uri;
  binddn = options.binddn ? "-D " + options.binddn : '';
  passwd = options.passwd ? "-w " + options.passwd : '';
  if (options.url) {
    console.log("Nikita: option 'options.url' is deprecated, use 'options.uri'");
    if (options.uri == null) {
      options.uri = options.url;
    }
  }
  if (options.uri === true) {
    options.uri = 'ldapi:///';
  }
  uri = options.uri ? "-H " + options.uri : '';
  if (!options.user) {
    return callback(Error("Nikita `ldap.user`: required property 'user'"));
  }
  if (!Array.isArray(options.user)) {
    options.user = [options.user];
  }
  modified = false;
  return each(options.user).call((function(_this) {
    return function(user, callback) {
      var do_checkpass, do_end, do_ldappass, do_user;
      do_user = function() {
        var entry, k, v;
        entry = {};
        for (k in user) {
          v = user[k];
          if (k === 'userPassword' && !/^\{SASL\}/.test(user.userPassword)) {
            continue;
          }
          entry[k] = v;
        }
        return _this.ldap.add({
          entry: entry,
          uri: options.uri,
          binddn: options.binddn,
          passwd: options.passwd
        }, function(err, updated, added) {
          if (err) {
            return callback(err);
          }
          if (added) {
            options.log({
              message: "User added",
              level: 'WARN',
              module: 'nikita/ldap/user'
            });
          } else if (updated) {
            options.log({
              message: "User updated",
              level: 'WARN',
              module: 'nikita/ldap/user'
            });
          }
          if (updated || added) {
            modified = true;
          }
          if (added) {
            return do_ldappass();
          } else {
            return do_checkpass();
          }
        });
      };
      do_checkpass = function() {
        if (!(user.userPassword || /^\{SASL\}/.test(user.userPassword))) {
          return do_end();
        }
        return _this.system.execute({
          cmd: "ldapsearch -D " + user.dn + " -w " + user.userPassword + " " + uri + " -b \"\" -s base \"objectclass=*\"",
          code_skipped: 49
        }, function(err, identical, stdout) {
          if (err) {
            return callback(err);
          }
          if (identical) {
            return do_end();
          } else {
            return do_ldappass();
          }
        });
      };
      do_ldappass = function() {
        if (!(user.userPassword || /^\{SASL\}/.test(user.userPassword))) {
          return do_end();
        }
        return _this.system.execute({
          cmd: "ldappasswd " + binddn + " " + passwd + " " + uri + " -s " + user.userPassword + " '" + user.dn + "'"
        }, function(err) {
          if (err) {
            return callback(err);
          }
          options.log({
            message: "Password modified",
            level: 'WARN',
            module: 'nikita/ldap/user'
          });
          modified = true;
          return do_end();
        });
      };
      do_end = function() {
        return callback();
      };
      return do_user();
    };
  })(this)).then(function(err) {
    return callback(err, modified);
  });
};

each = require('each');
