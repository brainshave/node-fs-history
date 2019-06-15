"use strict";

var OPEN_METHODS = [
  "open",
  "openSync",
  "readFile",
  "readFileSync",
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
    var accessedFiles = new Set();

    listeners.push(function (path) {
      accessedFiles.add(path);
    });

    return drain;

    function drain () {
      var previouslyOpened = [...accessedFiles.values()];
      accessedFiles = new Set();
      return previouslyOpened;
    }
  }
}
