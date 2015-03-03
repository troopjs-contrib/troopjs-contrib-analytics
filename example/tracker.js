define([ "troopjs-core/component/gadget" ], function (Component) {
  return Component.extend(function () {
    this.log("constructor", arguments);
  }, {
    "on/trigger": function (handler, type) {
      this.log("trigger", arguments);
    }
  })
});