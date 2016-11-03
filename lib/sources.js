'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = require('./actions');

var _utils = require('./utils');

var _runContextual = require('./runContextual');

var _runContextual2 = _interopRequireDefault(_runContextual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var computations = {};

exports.default = function (tracker) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        var throwIfNot = (0, _utils.errorWith)(action);

        if (action.type === _actions.REGISTER_REACTIVE_SOURCE) {
          var run = function run() {
            throwIfNot(_utils.hasKey, 'A registerReactiveSource action needs a `key` string to identify tracked source');

            throwIfNot(_utils.hasGet, 'A registerReactiveSource action needs a `get` function to load data');

            throwIfNot(function (x) {
              return !(0, _utils.hasSubscribe)(x);
            }, 'Use a startSubscription action to start a subscription');

            var key = action.payload.key;


            if (computations[key]) {
              computations[key].stop();
            }

            computations[key] = tracker.autorun(function () {
              dispatch({
                type: (0, _utils.actionCase)(key) + '_REACTIVE_SOURCE_CHANGED',
                payload: action.payload.get()
              });
            });
          };

          (0, _runContextual2.default)(run);
        }

        return next(action);
      };
    };
  };
};