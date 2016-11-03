'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = exports.types = exports.startSubscription = exports.START_SUBSCRIPTION = exports.stopSubscription = exports.STOP_SUBSCRIPTION = exports.registerReactiveSource = exports.REGISTER_REACTIVE_SOURCE = undefined;

var _utils = require('./utils');

var REGISTER_REACTIVE_SOURCE = exports.REGISTER_REACTIVE_SOURCE = 'REGISTER_REACTIVE_SOURCE';
var registerReactiveSource = exports.registerReactiveSource = (0, _utils.createAction)(REGISTER_REACTIVE_SOURCE);

var STOP_SUBSCRIPTION = exports.STOP_SUBSCRIPTION = 'STOP_SUBSCRIPTION';
var stopSubscription = exports.stopSubscription = (0, _utils.createAction)(STOP_SUBSCRIPTION);

var START_SUBSCRIPTION = exports.START_SUBSCRIPTION = 'START_SUBSCRIPTION';
var startSubscription = exports.startSubscription = (0, _utils.createAction)(START_SUBSCRIPTION);

var types = exports.types = [REGISTER_REACTIVE_SOURCE, STOP_SUBSCRIPTION, START_SUBSCRIPTION];

var actions = exports.actions = {
  registerReactiveSource: registerReactiveSource,
  stopSubscription: stopSubscription,
  startSubscription: startSubscription
};