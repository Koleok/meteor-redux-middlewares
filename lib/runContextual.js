'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

exports.default = function (run) {
  if ((0, _utils.isBrowser)()) {
    // setTimeout is fixing this bug:
    // https://github.com/meteor/react-packages/issues/99
    setImmediate(run);
  } else {
    run();
  }
};