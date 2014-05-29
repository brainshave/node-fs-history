"use strict";

module.exports = init;

var fs = require("fs");

var DEFAULT_METHODS = [
  "open",
  "openSync"
];

function init (methods) {
  var list = [];

  (methods || DEFAULT_METHODS).forEach(wrap);

  return drain;

  function drain () {
    var old = list;
    list = [];
    return old;
  }

  function wrap (name) {
    var original;

    // wrap only existing
    if (name in fs) {
      original = fs[name];

      fs[name] = function (path) {
        list.push(path);
        return original.apply(fs, arguments);
      }
    }
  }
}
