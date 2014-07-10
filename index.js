"use strict";

var OPEN_METHODS = [
  "open",
  "openSync"
];

module.exports = init(require("fs"), OPEN_METHODS);

function wrap (api, methods, callback) {
  methods.filter(function (name) {
    return name in api;
  }).forEach(function (name) {
    var original = api[name];
    api[name] = function (path) {
      callback.apply(api, arguments);
      return original.apply(api, arguments);
    }
  });
}

function init (api, methods) {
  var listeners = [];

  wrap(api, methods, count);

  return create_drain;

  function count (path) {
    listeners.forEach(function (listener) {
      listener(path);
    });
  }

  function create_drain () {
    var list = [];

    listeners.push(function (path) {
      list.push(path);
    });

    return drain;

    function drain () {
      var old = list;
      list = [];
      return old;
    }
  }
}
