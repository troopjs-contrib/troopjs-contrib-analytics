define([
  "troopjs-dom/component",
  "mu-state/main",
  "troopjs-compose/decorator/from",
  "troopjs-core/component/signal/start",
  "troopjs-core/component/signal/finalize",
  "when/when",
  "require",
  "poly/array"
], function (Component, State, from, start, finalize, when, localRequire) {
  "use strict";

  var ARRAY_SLICE = Array.prototype.slice;
  var ARRAY_PUSH = Array.prototype.push;
  var OBJECT_TOSTRING = Object.prototype.toString;
  var TOSTRING_STRING = "[object String]";
  var TOSTRING_ARRAY = "[object Array]";
  var TOSTRING_OBJECT = "[object Object]";
  var TOSTRING_UNDEFINED = "[object Undefined]";
  var NAME = "name";
  var ARGS = "args";
  var TRIGGER = "trigger";
  var PUT = "put";
  var GET = "get";

  function _emit(type, scope) {
    var me = this;

    return function () {
      var args = [ type, scope ];

      ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments));

      return me.emit.apply(me, args);
    };
  }

  return Component.extend(function ($element, name, trackers) {
    var me = this;
    var _trackers;

    switch (OBJECT_TOSTRING.call(trackers)) {
      case TOSTRING_UNDEFINED:
        return;

      case TOSTRING_STRING:
        _trackers = [ trackers ];
        break;

      case TOSTRING_OBJECT:
        _trackers = Object
          .keys(trackers)
          .map(function (tracker) {
            var _tracker = {};
            _tracker[NAME] = tracker;
            _tracker[ARGS] = trackers[tracker];
            return _tracker;
          });
        break;

      case TOSTRING_ARRAY:
        _trackers = trackers;
        break;

      default:
        throw new Error("'trackers' is of unsupported type");
    }

    me.on("sig/initialize", function () {
      return when.map(_trackers, function (_tracker) {
        var name;
        var args;

        switch (OBJECT_TOSTRING.call(_tracker)) {
          case TOSTRING_STRING:
            name = _tracker;
            args = [];
            break;

          case TOSTRING_ARRAY:
            name = _tracker[0];
            args = _tracker.slice(1);
            break;

          case TOSTRING_OBJECT:
            name = _tracker[NAME];
            args = _tracker[ARGS];

            if (OBJECT_TOSTRING.call(args) !== TOSTRING_ARRAY) {
              args = [ args ];
            }
            break;

          default:
            throw new Error("'_tracker' is of unsupported type");
        }

        return when
          .promise(function (resolve, reject) {
            localRequire([ name ], resolve, reject);
          })
          .tap(function (Tracker) {
            var tracker = Tracker.apply(Tracker, args);
            var _trigger = _emit.call(tracker, TRIGGER, me);
            var _put = _emit.call(tracker, PUT, me);
            var _get = _emit.call(tracker, GET, me);

            tracker.on("sig/initialize", function () {
              me.on(PUT, _put);
              me.on(GET, _get);
              me.on(TRIGGER, _trigger);
            });
            tracker.on("sig/finalize", function () {
              me.off(PUT, _put);
              me.off(GET, _get);
              me.off(TRIGGER, _trigger);
            });
            me.on("sig/start", function () {
              return start.call(tracker);
            });
            me.on("sig/finalize", function () {
              return finalize.call(tracker);
            });
          });
      });
    });
  }, {
    "put": from(State),
    "get": from(State),
    "has": from(State),
    "putIfNotHas": from(State),

    "dom/analytics/trigger": function ($event, type) {
      var me = this;
      var args = [ TRIGGER ];

      ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments, 1));

      return me.emit.apply(me, args);
    }
  });
});