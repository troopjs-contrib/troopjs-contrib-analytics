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


  var UNDEFINED;
  var ARRAY_SLICE = Array.prototype.slice;
  var ARRAY_PUSH = Array.prototype.push;
  var OBJECT_TOSTRING = Object.prototype.toString;
  var TOSTRING_STRING = "[object String]";
  var TOSTRING_ARRAY = "[object Array]";
  var TOSTRING_OBJECT = "[object Object]";
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

    if (trackers !== UNDEFINED) {
      me.on("sig/initialize", function () {
        return when.map(trackers, function (settings) {
          var name;
          var args;

          switch (OBJECT_TOSTRING.call(settings)) {
            case TOSTRING_STRING:
              name = settings;
              args = [];
              break;

            case TOSTRING_ARRAY:
              name = settings[0];
              args = settings.slice(1);
              break;

            case TOSTRING_OBJECT:
              name = settings[NAME];
              args = settings[ARGS];

              if (OBJECT_TOSTRING.call(args) !== TOSTRING_ARRAY) {
                args = [ args ];
              }
              break;

            default:
              throw new Error("'settings' is of unsupported type");
          }

          return when
            .promise(function (resolve, reject) {
              localRequire([ name ], resolve, reject);
            })
            .tap(function (Tracker) {
              var _tracker = Tracker.apply(Tracker, args);
              var _trigger = _emit.call(_tracker, TRIGGER, me);
              var _put = _emit.call(_tracker, PUT, me);
              var _get = _emit.call(_tracker, GET, me);

              _tracker.on("sig/initialize", function () {
                me.on(PUT, _put);
                me.on(GET, _get);
                me.on(TRIGGER, _trigger);
              });
              _tracker.on("sig/finalize", function () {
                me.off(PUT, _put);
                me.off(GET, _get);
                me.off(TRIGGER, _trigger);
              });
              me.on("sig/start", function () {
                return start.call(_tracker);
              });
              me.on("sig/finalize", function () {
                return finalize.call(_tracker);
              });
            });
        });
      });
    }
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