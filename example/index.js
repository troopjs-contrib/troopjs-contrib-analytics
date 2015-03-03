require({
  "baseUrl": "../bower_components",
  "packages": [{
    "name": "troopjs-contrib-analytics",
    "location": ".."
  }],

  "deps": [ "jquery", "require", "troopjs/main", "troopjs-widget/main" ],

  "paths": {
    "jquery": "jquery/dist/jquery.min"
  },

  "callback": function (jQuery, localRequire) {
    localRequire([ "troopjs-widget/application" ], function (Application) {
      jQuery(function ($) {
        // Update text
        $("[data-triggers]").text(function () {
          return $(this).attr("data-triggers");
        });
        // Start application
        Application($("html"), "application").start();
      });
    });
  }
});