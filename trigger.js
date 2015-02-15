define([
  "troopjs-dom/component",
  "poly/object",
  "poly/array"
], function (Component) {
  var UNDEFINED;
  var $ELEMENT = "$element";

  return Component.extend(function ($element, name, triggers) {
    var me = this;

    if (triggers !== UNDEFINED) {
      me.on("sig/initialize", function () {
        Object
          .keys(triggers)
          .forEach(function (type) {
            me.on("dom/" + type, function () {
              me[$ELEMENT].trigger("analytics/trigger", triggers[type]);
            });
          });
      });
    }
  });
});