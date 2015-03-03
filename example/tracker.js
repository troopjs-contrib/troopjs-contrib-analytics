define([ "troopjs-core/component/gadget" ], function (Component) {
  return Component.extend(function () {
    this.log("constructor", arguments);
  }, {
    "on/trigger": function () {
      this.log("trigger", arguments);
    }
  })
});