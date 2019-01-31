(function IIFE() {
  "use strict";

  /////////////////////////////

  function lxProgressControler() {
    var lxProgress = this;
  }

  /////////////////////////////

  function lxProgressDirective() {
    return {
      bindToController: true,
      controller: lxProgressControler,
      controllerAs: "lxProgress",
      replace: true,
      restrict: "E",
      scope: {
        type: "@?lxType"
      },
      templateUrl: "src/components/lx-progress/angular-js/lx-progress.html",
      transclude: {
        help: "?lxCheckboxHelp",
        label: "?lxCheckboxLabel"
      }
    };
  }

  /////////////////////////////

  angular.module("lumx.progress").directive("lxProgress", lxProgressDirective);
})();
