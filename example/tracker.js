define([ "troopjs-core/component/emitter" ], function (Component) {
  return Component.extend(
    function () {
      console.log("constructor", arguments);
    },

    {
      "on/trigger": function (handler, type) {
        console.log("trigger", arguments);
      }
    });
});
