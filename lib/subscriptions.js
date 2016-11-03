'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _runContextual = require('./runContextual');

var _runContextual2 = _interopRequireDefault(_runContextual);

var _actions = require('./actions');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subscriptions = {};
var computations = {};

exports.default = function (tracker) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        var throwIfNot = (0, _utils.errorWith)(action);

        if (action.type === _actions.STOP_SUBSCRIPTION) {
          var stop = function stop() {
            throwIfNot(_utils.stringPayload, 'A stopSubscription action needs a string payload to identify a subscription');

            if (subscriptions[action.payload]) {
              var subscriptionId = subscriptions[action.payload].subscriptionId;

              computations[subscriptionId].stop();
              subscriptions[action.payload].stop();
            }
          };

          (0, _runContextual2.default)(stop);
        }

        if (action.type === _actions.START_SUBSCRIPTION) {
          var start = function start() {
            throwIfNot(_utils.hasSubscribe, 'A startSubscription action needs a `subscribe` function to start a subscription');

            throwIfNot(_utils.hasKey, 'A startSubscription action needs a `key` string to identify a subscription');

            throwIfNot(_utils.hasGet, 'A startSubscription action needs a `get` function to load data');

            var _action$payload = action.payload,
                key = _action$payload.key,
                subscribe = _action$payload.subscribe;


            if (subscriptions[key]) {
              dispatch((0, _actions.stopSubscription)(key));
            }

            var subscription = subscribe();
            var subscriptionId = subscription.subscriptionId;


            subscriptions[key] = subscription;
            computations[subscriptionId] = tracker.autorun(function () {
              var ready = subscription.ready();

              if (ready) {
                dispatch({
                  type: (0, _utils.actionCase)(key) + '_SUBSCRIPTION_CHANGED',
                  payload: action.payload.get()
                });
              }

              dispatch({
                type: (0, _utils.actionCase)(key) + '_SUBSCRIPTION_READY',
                payload: {
                  ready: ready,
                  data: action.payload.onReadyData ? action.payload.onReadyData() : {}
                }
              });
            });
          };

          (0, _runContextual2.default)(start);
        }

        return next(action);
      };
    };
  };
};