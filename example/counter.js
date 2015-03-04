define([ "troopjs-core/component/gadget" ], function (Component) {
  return Component.extend({
    "on/get": function (handler, key) {
      var result;

      switch (key) {
        case "session":
          result = handler.putIfNotHas(key, Math.random().toString(36).substr(2));
          break;
      }

      return result;
    },

    "on/trigger": function (handler, type, inc) {
      var me = this;
      var key = "count." + type;

      return handler
        .get(key, 0)
        .tap(function (count) {
          me.log("old", type, count);
        })
        .then(function (count) {
          return handler.put(key, count + inc);
        })
        .tap(function (count) {
          me.log("new", type, count);
        })
        .tap(function () {
          return handler
            .get([ "session", "count" ])
            .spread(function (session, count) {
              me.log("all", {
                "count": count,
                "session": session
              });
            });
        });
    }
  })
});