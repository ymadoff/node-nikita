// Generated by CoffeeScript 1.12.4
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports = function(options) {
  var chkname, pkgname, srvname;
  options.log({
    message: "Entering service",
    level: 'DEBUG',
    module: 'nikita/lib/service'
  });
  if (typeof options.argument === 'string') {
    if (options.name == null) {
      options.name = options.argument;
    }
  }
  pkgname = options.yum_name || options.name;
  chkname = options.chk_name || options.srv_name || options.name;
  srvname = options.srv_name || options.chk_name || options.name;
  if (typeof options.action === 'string') {
    options.action = options.action.split(',');
  }
  if (options.store == null) {
    options.store = {};
  }
  this.service.install({
    name: pkgname,
    cache: options.cache,
    cacheonly: options.cacheonly,
    "if": pkgname,
    installed: options.installed,
    outdated: options.outdated
  });
  this.service.startup({
    name: chkname,
    startup: options.startup,
    "if": options.startup != null
  });
  return this.call({
    "if": function() {
      return options.action;
    }
  }, function() {
    this.service.status({
      name: srvname,
      code_started: options.code_started,
      code_stopped: options.code_stopped,
      shy: true
    });
    this.service.start({
      name: srvname,
      "if": function() {
        return !this.status(-1) && indexOf.call(options.action, 'start') >= 0;
      }
    });
    this.service.stop({
      name: srvname,
      "if": function() {
        return this.status(-2) && indexOf.call(options.action, 'stop') >= 0;
      }
    });
    return this.service.restart({
      name: srvname,
      "if": function() {
        return this.status(-3) && indexOf.call(options.action, 'restart') >= 0;
      }
    });
  });
};
