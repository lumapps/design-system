(function IIFE() {
  "use strict";

  /////////////////////////////

  lxDropdownController.$inject = [
    "$document",
    "$scope",
    "$timeout",
    "$window",
    "LxDepthService",
    "LxDropdownService",
    "LxEventSchedulerService",
    "LxUtilsService"
  ];

  function lxDropdownController(
    $document,
    $scope,
    $timeout,
    $window,
    LxDepthService,
    LxDropdownService,
    LxEventSchedulerService,
    LxUtilsService
  ) {
    var lxDropdown = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * Offset from the edge of the view port if dropdown is higher.
     *
     * @type {integer}
     */
    var _OFFSET_FROM_EDGE = 16;

    /**
     * The source element mouse enter timeout.
     *
     * @type {Object}
     */
    var _hoverTimeout;

    /**
     * The event scheduler id.
     *
     * @type {string}
     */
    var _idEventScheduler;

    /**
     * The menu element.
     *
     * @type {element}
     */
    var _menuEl;

    /**
     * Wether the user pointer is on menu or not.
     * Useful to know wether or not close the menu in hover mode.
     *
     * @type {boolean}
     */
    var _mouseOnMenu = false;

    /**
     * The toggle element.
     *
     * @type {element}
     */
    var _toggleEl;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Wether the directive has toggle slot filled or not.
     *
     * @type {boolean}
     */
    lxDropdown.hasToggle = false;

    /**
     * Wether the dropdown is open or not.
     *
     * @type {boolean}
     */
    lxDropdown.isOpen = false;

    /**
     * The dropdown uuid.
     *
     * @type {string}
     */
    lxDropdown.uuid = LxUtilsService.generateUUID();

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Close dropdown.
     */
    function _close() {
      lxDropdown.isOpen = false;

      LxDropdownService.resetActiveDropdownUuid();

      LxUtilsService.restoreBodyScroll();

      $timeout(function() {
        _menuEl.removeAttr("style").insertAfter(_toggleEl);

        if (
          angular.isUndefined(lxDropdown.escapeClose) ||
          lxDropdown.escapeClose
        ) {
          LxEventSchedulerService.unregister(_idEventScheduler);
          _idEventScheduler = undefined;
        }

        $document.off("click", _onDocumentClick);
      });
    }

    /**
     * Get available height.
     *
     * @return {Object} Available height on top / bottom.
     */
    function _getAvailableHeight() {
      var availaibleHeight = {};
      var toggleProps = {
        height: _toggleEl.outerHeight(),
        top: _toggleEl.offset().top - angular.element($window).scrollTop()
      };
      var windowProps = {
        height: $window.innerHeight
      };

      if (lxDropdown.overToggle) {
        availaibleHeight.above = toggleProps.top;
        availaibleHeight.below = windowProps.height - toggleProps.top;
      } else {
        availaibleHeight.above = toggleProps.top;
        availaibleHeight.below =
          windowProps.height - (toggleProps.top + toggleProps.height);
      }

      return availaibleHeight;
    }

    /**
     * Initialize horizontal position.
     */
    function _initHorizontalPosition() {
      var menuProps = {};
      var toggleProps = {
        left: _toggleEl.offset().left,
        height: _toggleEl.outerHeight(),
        width: _toggleEl.outerWidth()
      };
      var windowProps = {
        height: $window.innerHeight,
        width: $window.innerWidth
      };

      if (angular.isDefined(lxDropdown.width)) {
        if (lxDropdown.width.indexOf("%") > -1) {
          menuProps.minWidth =
            toggleProps.width * (lxDropdown.width.slice(0, -1) / 100);
        } else {
          menuProps.width = lxDropdown.width;
        }
      } else {
        menuProps.width = "auto";
      }

      if (lxDropdown.position === "left") {
        menuProps.left = toggleProps.left;
        menuProps.right = "auto";
      } else if (lxDropdown.position === "right") {
        menuProps.left = "auto";
        menuProps.right =
          windowProps.width - toggleProps.width - toggleProps.left;
      }

      _menuEl.css({
        left: menuProps.left,
        right: menuProps.right
      });

      if (angular.isDefined(menuProps.minWidth)) {
        _menuEl.css({
          minWidth: menuProps.minWidth
        });
      } else {
        _menuEl.css({
          width: menuProps.width
        });
      }
    }

    /**
     * Initialize vertical position.
     */
    function _initVerticalPosition() {
      var availaibleHeight = _getAvailableHeight();
      var menuProps = {};
      var windowProps = {
        height: $window.innerHeight
      };

      if (availaibleHeight.below > availaibleHeight.above) {
        if (lxDropdown.overToggle) {
          menuProps.top = availaibleHeight.above;
          menuProps.maxHeight = availaibleHeight.below;
        } else {
          menuProps.top =
            availaibleHeight.above +
            _toggleEl.outerHeight() +
            ~~lxDropdown.offset;
          menuProps.maxHeight = availaibleHeight.below;
        }
      } else {
        if (lxDropdown.overToggle) {
          menuProps.bottom =
            windowProps.height -
            availaibleHeight.above -
            _toggleEl.outerHeight();
          menuProps.maxHeight =
            availaibleHeight.above + _toggleEl.outerHeight();
        } else {
          menuProps.bottom =
            windowProps.height - availaibleHeight.above + ~~lxDropdown.offset;
          menuProps.maxHeight = availaibleHeight.above;
        }
      }

      menuProps.maxHeight -= _OFFSET_FROM_EDGE;

      _menuEl.css(menuProps);
    }

    /**
     * Close dropdown on document click.
     */
    function _onDocumentClick() {
      if (
        angular.isUndefined(lxDropdown.closeOnClick) ||
        lxDropdown.closeOnClick
      ) {
        LxDropdownService.closeActiveDropdown();
      }
    }

    /**
     * Close dropdown on echap key up.
     *
     * @param {Event} evt The key up event.
     */
    function _onKeyUp(evt) {
      if (evt.keyCode == 27) {
        LxDropdownService.closeActiveDropdown();
      }

      evt.stopPropagation();
    }

    /**
     * Open dropdown.
     */
    function _open() {
      LxDropdownService.closeActiveDropdown();
      LxDropdownService.registerActiveDropdownUuid(lxDropdown.uuid);

      if (
        angular.isUndefined(lxDropdown.escapeClose) ||
        lxDropdown.escapeClose
      ) {
        _idEventScheduler = LxEventSchedulerService.register("keyup", _onKeyUp);
      }

      LxDepthService.increase();

      _menuEl.appendTo("body").css("z-index", LxDepthService.get());

      $timeout(function() {
        _initHorizontalPosition();
        _initVerticalPosition();

        lxDropdown.isOpen = true;
        LxUtilsService.disableBodyScroll();

        $document.on("click", _onDocumentClick);
      });
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Close dropdown on mouse enter.
     *
     * @param {string} fromMenu Wether the function is triggered from the menu or from the toggle.
     */
    function closeOnMouseLeave(fromMenu) {
      if (!lxDropdown.hover) {
        return;
      }

      $timeout.cancel(_hoverTimeout);

      $timeout(function() {
        if (!_mouseOnMenu || fromMenu) {
          LxDropdownService.closeActiveDropdown();
        }

        if (fromMenu) {
          _mouseOnMenu = false;
        }
      }, lxDropdown.hoverDelay);
    }

    /**
     * Open dropdown on mouse leave.
     */
    function openOnMouseEnter() {
      if (!lxDropdown.hover || lxDropdown.isOpen) {
        return;
      }

      _hoverTimeout = $timeout(_open, lxDropdown.hoverDelay);
    }

    /**
     * Register menu.
     *
     * @param {element} menuEl The menu element.
     */
    function registerMenu(menuEl) {
      _menuEl = menuEl;
    }

    /**
     * Register the fact that user pointer is on the menu.
     */
    function registerMouseEnterEvent() {
      _mouseOnMenu = true;
    }

    /**
     * Register toggle.
     *
     * @param {element} toggleEl The toggle element.
     */
    function registerToggle(toggleEl) {
      _toggleEl = toggleEl;
    }

    /**
     * Toggle the dropdown on toggle click.
     */
    function toggle() {
      if (lxDropdown.hover) {
        return;
      }

      if (lxDropdown.isOpen) {
        LxDropdownService.closeActiveDropdown();
      } else {
        _open();
      }
    }

    /////////////////////////////

    lxDropdown.closeOnMouseLeave = closeOnMouseLeave;
    lxDropdown.openOnMouseEnter = openOnMouseEnter;
    lxDropdown.registerMenu = registerMenu;
    lxDropdown.registerMouseEnterEvent = registerMouseEnterEvent;
    lxDropdown.registerToggle = registerToggle;
    lxDropdown.toggle = toggle;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Open a given dropdown.
     *
     * @param {Event}  evt    The dropdown open event.
     * @param {Object} params The dropdown uuid and the target id.
     */
    $scope.$on("lx-dropdown__open", function onDropdownOpen(evt, params) {
      if (params.uuid === lxDropdown.uuid && !lxDropdown.isOpen) {
        registerToggle(angular.element(params.target));
        _open();
      }
    });

    /**
     * Close a given dropdown.
     *
     * @param {Event}  evt    The dropdown open event.
     * @param {Object} params The dropdown uuid.
     */
    $scope.$on("lx-dropdown__close", function(evt, params) {
      if (params.uuid === lxDropdown.uuid && lxDropdown.isOpen) {
        _close();
      }
    });
  }

  /////////////////////////////

  function lxDropdownDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
      ctrl.registerToggle(el.find(".lx-dropdown__toggle"));
      ctrl.registerMenu(el.find(".lx-dropdown__menu"));

      if (transclude.isSlotFilled("toggle")) {
        ctrl.hasToggle = true;
      }

      attrs.$observe("id", function(id) {
        ctrl.uuid = id;
      });
    }

    return {
      bindToController: true,
      controller: lxDropdownController,
      controllerAs: "lxDropdown",
      link: link,
      replace: true,
      restrict: "E",
      scope: {
        closeOnClick: "=?lxCloseOnClick",
        escapeClose: "=?lxEscapeClose",
        hover: "=?lxHover",
        hoverDelay: "=?lxHoverDelay",
        offset: "@?lxOffset",
        overToggle: "=?lxOverToggle",
        position: "@?lxPosition",
        width: "@?lxWidth"
      },
      templateUrl: "src/components/lx-dropdown/angular-js/lx-dropdown.html",
      transclude: {
        toggle: "?lxDropdownToggle",
        menu: "lxDropdownMenu"
      }
    };
  }

  /////////////////////////////

  angular.module("lumx.dropdown").directive("lxDropdown", lxDropdownDirective);
})();
