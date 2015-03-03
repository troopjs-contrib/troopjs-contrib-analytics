define([
  "troopjs-dom/component",
  "poly/object",
  "poly/array"
], function (Component) {
  "use strict";

  var OBJECT_TOSTRING = Object.prototype.toString;
  var TOSTRING_STRING = "[object String]";
  var TOSTRING_ARRAY = "[object Array]";
  var TOSTRING_OBJECT = "[object Object]";
  var TOSTRING_UNDEFINED = "[object Undefined]";
  var $ELEMENT = "$element";
  var RE = /\s+/;

  return Component.extend(function ($element, name, triggers) {
    var me = this;
    var _triggers;

    switch (OBJECT_TOSTRING.call(triggers)) {
      case TOSTRING_UNDEFINED:
        return;

      case TOSTRING_STRING:
        _triggers = triggers.split(RE);
        break;

      case TOSTRING_OBJECT:
        _triggers = Object
          .keys(triggers)
          .map(function (trigger) {
            return [ trigger ].concat(triggers[trigger]);
          });
        break;

      case TOSTRING_ARRAY:
        _triggers = triggers;
        break;

      default:
        throw new Error("'triggers' is of unsupported type");
    }

    me.on("sig/initialize", function () {
      _triggers.forEach(function (_trigger) {
        var name;
        var args;

        switch (OBJECT_TOSTRING.call(_trigger)) {
          case TOSTRING_STRING:
            name = "click";
            args = [ _trigger ];
            break;

          case TOSTRING_ARRAY:
            name = _trigger[0];
            args = _trigger.slice(1);
            break;

          default:
            throw new Error("'_trigger' is of unsupported type");
        }

        me.on("dom/" + name, function () {
          me[$ELEMENT].trigger("analytics/trigger", args);
        });
      });
    });
  });
});