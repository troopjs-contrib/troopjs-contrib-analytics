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

  return Component.extend(function ($element, name, triggers) {
    var me = this;
    var _triggers;

    switch (OBJECT_TOSTRING.call(triggers)) {
      case TOSTRING_UNDEFINED:
        return;

      case TOSTRING_STRING:
        _triggers = {};
        _triggers[ "click" ] = triggers;
        break;

      case TOSTRING_ARRAY:
        _triggers = {};
        _triggers[ triggers[0] ] = triggers.slice(1);
        break;

      case TOSTRING_OBJECT:
        _triggers = triggers;
        break;

      default:
        throw new Error("'triggers' is of unsupported type");
    }

    me.on("sig/initialize", function () {
      Object
        .keys(_triggers)
        .forEach(function (type) {

          me.on("dom/" + type, function () {
            me[$ELEMENT].trigger("analytics/trigger", _triggers[type]);
          });
        });
      });
  });
});