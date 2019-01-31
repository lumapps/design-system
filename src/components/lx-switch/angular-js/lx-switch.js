(function IIFE() {
  "use strict";

  /////////////////////////////

  lxSwitchControler.$inject = ["$element", "LxUtilsService"];

  function lxSwitchControler($element, LxUtilsService) {
    var lxSwitch = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The model controller.
     *
     * @type {Object}
     */
    var _modelController;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The switch id.
     *
     * @type {string}
     */
    lxSwitch.switchId = LxUtilsService.generateUUID();

    /**
     * Wether the directive has help slot filled or not.
     *
     * @type {boolean}
     */
    lxSwitch.hasHelp = false;

    /**
     * Wether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lxSwitch.hasLabel = false;

    /**
     * Wether the directive has transcluded content if no transclude slot.
     *
     * @type {boolean}
     */
    lxSwitch.hasTranscluded = false;

    /**
     * The model view value.
     *
     * @type {string}
     */
    lxSwitch.viewValue = undefined;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
      _modelController = modelController;

      _modelController.$render = function onModelRender() {
        lxSwitch.viewValue = _modelController.$viewValue;
      };
    }

    /**
     * Update model controller view value on switch click.
     */
    function updateViewValue() {
      if (angular.isUndefined(_modelController)) {
        lxSwitch.viewValue = !lxSwitch.viewValue;
        return;
      }

      _modelController.$setViewValue(!_modelController.$viewValue);
      _modelController.$render();
    }

    /////////////////////////////

    lxSwitch.setModelController = setModelController;
    lxSwitch.updateViewValue = updateViewValue;
  }

  /////////////////////////////

  function lxSwitchDirective() {
    function link(scope, el, attrs, ctrls, transclude) {
      if (ctrls[1]) {
        ctrls[0].setModelController(ctrls[1]);
      }

      if (transclude.isSlotFilled("label")) {
        ctrls[0].hasLabel = true;
      }

      if (transclude.isSlotFilled("help")) {
        ctrls[0].hasHelp = true;
      }

      if (!ctrls[0].hasLabel && !ctrls[0].hasHelp) {
        transclude(function(clone) {
          if (clone.length) {
            ctrls[0].hasTranscluded = true;
          }
        });
      }

      attrs.$observe("disabled", function(isDisabled) {
        el.find("input").attr("disabled", isDisabled);

        if (isDisabled) {
          el.addClass("lx-switch--is-disabled");
        } else {
          el.removeClass("lx-switch--is-disabled");
        }
      });

      attrs.$observe("checked", function(isChecked) {
        el.find("input").attr("checked", isChecked);

        ctrls[0].viewValue = isChecked;
      });
    }

    return {
      bindToController: true,
      controller: lxSwitchControler,
      controllerAs: "lxSwitch",
      link: link,
      replace: true,
      require: ["lxSwitch", "?ngModel"],
      restrict: "E",
      scope: {
        theme: "@?lxTheme"
      },
      templateUrl: "src/components/lx-switch/angular-js/lx-switch.html",
      transclude: {
        help: "?lxSwitchHelp",
        label: "?lxSwitchLabel"
      }
    };
  }

  /////////////////////////////

  angular.module("lumx.switch").directive("lxSwitch", lxSwitchDirective);
})();
