'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorWith = exports.isBrowser = exports.injectTracker = exports.createAction = exports.actionCase = exports.hasGet = exports.hasKey = exports.hasSubscribe = exports.stringPayload = exports.has = undefined;

var _sanctuary = require('sanctuary');

var _sanctuary2 = _interopRequireDefault(_sanctuary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var has = exports.has = _sanctuary2.default.meld([_sanctuary2.default.gets, _sanctuary2.default.isJust]);

var hasFunc = has(Function);
var hasString = has(String);

var payload = ['payload'];
var path = function path(key) {
  return payload.concat(key);
};
var stringPayload = exports.stringPayload = hasString(payload);

var hasSubscribe = exports.hasSubscribe = hasFunc(path('subscribe'));
var hasKey = exports.hasKey = hasString(path('key'));
var hasGet = exports.hasGet = hasFunc(path('get'));

var actionCase = exports.actionCase = _sanctuary2.default.B(_sanctuary2.default.toUpper, function (x) {
  return x.replace('.', '_');
});

var createAction = exports.createAction = function createAction(type) {
  return function () {
    var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return { type: type, payload: payload, meta: meta };
  };
};

var injectTracker = exports.injectTracker = function injectTracker(tracker, middlewares) {
  return middlewares.map(function (m) {
    return m(tracker);
  });
};

var isBrowser = exports.isBrowser = function isBrowser() {
  return typeof process === 'undefined';
};

var errorWith = exports.errorWith = function errorWith(x) {
  return function (f, msg) {
    if (!f(x)) {
      throw new Error(msg);
    }
  };
};