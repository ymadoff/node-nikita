// Generated by CoffeeScript 1.12.4
var load, merge, registry;

load = function(middleware) {
  var ref;
  if (!(typeof middleware === 'object' && (middleware != null) && !Array.isArray(middleware))) {
    middleware = {
      handler: middleware
    };
  }
  if ((ref = typeof middleware.handler) !== 'function' && ref !== 'string') {
    throw Error("Invalid middleware handler: got " + (JSON.stringify(middleware.handler)));
  }
  if (typeof middleware.handler !== 'string') {
    return middleware;
  }
  middleware.module = middleware.handler;
  middleware.handler = /^nikita\//.test(middleware.handler) ? require("." + (middleware.handler.substr(6))) : require.main.require(middleware.handler);
  return middleware;
};

registry = function(obj) {
  Object.defineProperty(obj, 'get', {
    configurable: true,
    enumerable: false,
    get: function() {
      return function(name) {
        var cnames, i, j, len, n;
        if (!name) {
          return merge({}, obj);
        }
        if (typeof name === 'string') {
          name = [name];
        }
        cnames = obj;
        for (i = j = 0, len = name.length; j < len; i = ++j) {
          n = name[i];
          if (!cnames[n]) {
            return null;
          }
          if (cnames[n] && cnames[n][''] && i === name.length - 1) {
            return cnames[n][''];
          }
          cnames = cnames[n];
        }
        return null;
      };
    }
  });
  Object.defineProperty(obj, 'register', {
    configurable: true,
    enumerable: false,
    get: function() {
      return function(name, handler) {
        var cnames, j, n, name1, names, ref, walk;
        if (typeof name === 'string') {
          name = [name];
        }
        if (Array.isArray(name)) {
          handler = load(handler);
          cnames = names = obj;
          for (n = j = 0, ref = name.length - 1; 0 <= ref ? j < ref : j > ref; n = 0 <= ref ? ++j : --j) {
            n = name[n];
            if (cnames[n] == null) {
              cnames[n] = {};
            }
            cnames = cnames[n];
          }
          if (cnames[name1 = name[name.length - 1]] == null) {
            cnames[name1] = {};
          }
          cnames[name[name.length - 1]][''] = handler;
          return merge(obj, names);
        } else {
          walk = function(obj) {
            var k, results, v;
            results = [];
            for (k in obj) {
              v = obj[k];
              if (k !== '' && v && typeof v === 'object' && !Array.isArray(v) && !v.handler) {
                results.push(walk(v));
              } else {
                v = load(v);
                results.push(obj[k] = k === '' ? v : {
                  '': v
                });
              }
            }
            return results;
          };
          walk(name);
          return merge(obj, name);
        }
      };
    }
  });
  Object.defineProperty(obj, 'deprecate', {
    configurable: true,
    enumerable: false,
    get: function() {
      return function(old_name, new_name, handler) {
        if (arguments.length === 2) {
          handler = new_name;
          new_name = null;
        }
        handler = load(handler);
        handler.deprecate = new_name;
        if (typeof handler.module === 'string') {
          if (handler.deprecate == null) {
            handler.deprecate = handler.module;
          }
        }
        if (handler.deprecate == null) {
          handler.deprecate = true;
        }
        return obj.register(old_name, handler);
      };
    }
  });
  Object.defineProperty(obj, 'registered', {
    configurable: true,
    enumerable: false,
    get: function() {
      return function(name) {
        var cnames, i, j, len, n;
        if (module.exports !== obj && module.exports.registered(name)) {
          return true;
        }
        if (typeof name === 'string') {
          name = [name];
        }
        cnames = obj;
        for (i = j = 0, len = name.length; j < len; i = ++j) {
          n = name[i];
          if (!cnames[n]) {
            return false;
          }
          if (cnames[n][''] && i === name.length - 1) {
            return true;
          }
          cnames = cnames[n];
        }
        return false;
      };
    }
  });
  return Object.defineProperty(obj, 'unregister', {
    configurable: true,
    enumerable: false,
    get: function() {
      return function(name) {
        var cnames, i, j, len, n;
        if (typeof name === 'string') {
          name = [name];
        }
        cnames = obj;
        for (i = j = 0, len = name.length; j < len; i = ++j) {
          n = name[i];
          if (i === name.length - 1) {
            delete cnames[n];
          }
          cnames = cnames[n];
          if (!cnames) {
            return;
          }
        }
      };
    }
  });
};

registry(module.exports);

Object.defineProperty(module.exports, 'registry', {
  configurable: true,
  enumerable: false,
  get: function() {
    return registry;
  }
});

merge = require('./misc').merge;
