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

        $("[data-triggers]").each(function (index, element) {
          var $element = $(element);

          $element.text($element.attr("data-triggers"));
        });

        Application($("html"), "application").start();
      });
    });
  }
});