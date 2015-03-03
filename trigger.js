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
  var NAME = "name";
  var ARGS = "args";

  return Component.extend(function ($element, name, triggers) {
    var me = this;
    var _triggers;

    switch (OBJECT_TOSTRING.call(triggers)) {
      case TOSTRING_UNDEFINED:
        return;

      case TOSTRING_STRING:
        _triggers = [ triggers ];
        break;

      case TOSTRING_OBJECT:
        _triggers = Object
          .keys(triggers)
          .map(function (trigger) {
            var _trigger = {};
            _trigger[NAME] = trigger;
            _trigger[ARGS] = triggers[trigger];
            return _trigger;
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

          case TOSTRING_OBJECT:
            name = _trigger[NAME];
            args = _trigger[ARGS];

            if (OBJECT_TOSTRING.call(args) !== TOSTRING_ARRAY) {
              args = [ args ];
            }
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