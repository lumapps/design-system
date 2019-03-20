import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-dropdown.html';

/////////////////////////////

function lxDropdownController(
    $document,
    $scope,
    $timeout,
    $window,
    NglxDepthService,
    NglxDropdownService,
    NglxEventSchedulerService,
    NglxUtilsService,
) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lxDropdown = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The escape key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _ESCAPE_KEY_CODE = 27;

    /**
     * Offset from the edge of the view port if dropdown is higher.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _OFFSET_FROM_EDGE = 16;

    /**
     * The event scheduler id.
     *
     * @type {string}
     */
    // eslint-disable-next-line one-var
    let _idEventScheduler;

    /**
     * The menu element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _menuEl;

    /**
     * The source element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _sourceEl;

    /**
     * The toggle element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _toggleEl;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has toggle slot filled or not.
     *
     * @type {boolean}
     */
    lxDropdown.hasToggle = false;

    /**
     * Whether the dropdown is open or not.
     *
     * @type {boolean}
     */
    lxDropdown.isOpen = false;

    /**
     * The dropdown uuid.
     *
     * @type {string}
     */
    lxDropdown.uuid = NglxUtilsService.generateUUID();

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Close dropdown on document click.
     */
    function _onDocumentClick() {
        if (angular.isUndefined(lxDropdown.closeOnClick) || lxDropdown.closeOnClick) {
            NglxDropdownService.closeActiveDropdown();
        }
    }

    /**
     * Close dropdown.
     */
    function _close() {
        lxDropdown.isOpen = false;

        NglxDropdownService.resetActiveDropdownId();

        NglxUtilsService.restoreBodyScroll();

        $timeout(() => {
            _menuEl.removeAttr('style').insertAfter(_toggleEl);

            if (angular.isUndefined(lxDropdown.escapeClose) || lxDropdown.escapeClose) {
                NglxEventSchedulerService.unregister(_idEventScheduler);
                _idEventScheduler = undefined;
            }

            $document.off('click keydown keypress', _onDocumentClick);

            if (angular.isDefined(_sourceEl)) {
                _sourceEl.focus();
            }
        });
    }

    /**
     * Get available height.
     *
     * @return {Object} Available height on top / bottom.
     */
    function _getAvailableHeight() {
        const availaibleHeight = {};
        const toggleProps = {
            height: _toggleEl.outerHeight(),
            top: _toggleEl.offset().top - angular.element($window).scrollTop(),
        };
        const windowProps = {
            height: $window.innerHeight,
        };

        if (lxDropdown.overToggle) {
            availaibleHeight.above = toggleProps.top;
            availaibleHeight.below = windowProps.height - toggleProps.top;
        } else {
            availaibleHeight.above = toggleProps.top;
            availaibleHeight.below = windowProps.height - (toggleProps.top + toggleProps.height);
        }

        return availaibleHeight;
    }

    /**
     * Initialize horizontal position.
     */
    function _initHorizontalPosition() {
        const menuProps = {};
        const toggleProps = {
            height: _toggleEl.outerHeight(),
            left: _toggleEl.offset().left,
            width: _toggleEl.outerWidth(),
        };
        const windowProps = {
            height: $window.innerHeight,
            width: $window.innerWidth,
        };

        if (angular.isDefined(lxDropdown.width)) {
            if (lxDropdown.width.indexOf('%') > -1) {
                // eslint-disable-next-line no-magic-numbers
                menuProps.minWidth = toggleProps.width * (lxDropdown.width.slice(0, -1) / 100);
            } else {
                menuProps.width = lxDropdown.width;
            }
        } else {
            menuProps.width = 'auto';
        }

        if (lxDropdown.position === 'left') {
            menuProps.left = toggleProps.left;
            menuProps.right = 'auto';
        } else if (lxDropdown.position === 'right') {
            menuProps.left = 'auto';
            menuProps.right = windowProps.width - toggleProps.width - toggleProps.left;
        }

        _menuEl.css({
            left: menuProps.left,
            right: menuProps.right,
        });

        if (angular.isDefined(menuProps.minWidth)) {
            _menuEl.css({
                minWidth: menuProps.minWidth,
            });
        } else {
            _menuEl.css({
                width: menuProps.width,
            });
        }
    }

    /**
     * Initialize vertical position.
     */
    function _initVerticalPosition() {
        const availaibleHeight = _getAvailableHeight();
        const menuProps = {};
        const windowProps = {
            height: $window.innerHeight,
        };

        if (availaibleHeight.below > availaibleHeight.above) {
            if (lxDropdown.overToggle) {
                menuProps.top = availaibleHeight.above;
                menuProps.maxHeight = availaibleHeight.below;
            } else {
                // eslint-disable-next-line no-bitwise
                menuProps.top = availaibleHeight.above + _toggleEl.outerHeight() + ~~lxDropdown.offset;
                menuProps.maxHeight = availaibleHeight.below;
            }
        } else if (lxDropdown.overToggle) {
            menuProps.bottom = windowProps.height - availaibleHeight.above - _toggleEl.outerHeight();
            menuProps.maxHeight = availaibleHeight.above + _toggleEl.outerHeight();
        } else {
            // eslint-disable-next-line no-bitwise
            menuProps.bottom = windowProps.height - availaibleHeight.above + ~~lxDropdown.offset;
            menuProps.maxHeight = availaibleHeight.above;
        }

        menuProps.maxHeight -= _OFFSET_FROM_EDGE;

        _menuEl.css(menuProps);
    }

    /**
     * Close dropdown on echap key up.
     *
     * @param {Event} evt The key up event.
     */
    function _onKeyUp(evt) {
        if (evt.keyCode === _ESCAPE_KEY_CODE) {
            NglxDropdownService.closeActiveDropdown();
        }

        evt.stopPropagation();
    }

    /**
     * Open dropdown.
     */
    function _open() {
        NglxDropdownService.closeActiveDropdown();
        NglxDropdownService.registerActiveDropdownId(lxDropdown.uuid);

        if (angular.isUndefined(lxDropdown.escapeClose) || lxDropdown.escapeClose) {
            _idEventScheduler = NglxEventSchedulerService.register('keyup', _onKeyUp);
        }

        NglxDepthService.increase();

        _menuEl.appendTo('body').css('z-index', NglxDepthService.get());

        $timeout(() => {
            _initHorizontalPosition();
            _initVerticalPosition();

            lxDropdown.isOpen = true;
            NglxUtilsService.disableBodyScroll();

            $document.on('click keydown keypress', _onDocumentClick);
        });
    }

    /**
     * Register the source element that triggered the dropdown.
     *
     * @param {element} sourceEl The source element that triggered the dropdown.
     */
    function _registerSource(sourceEl) {
        _sourceEl = sourceEl;
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Register menu.
     *
     * @param {element} menuEl The menu element.
     */
    function registerMenu(menuEl) {
        _menuEl = menuEl;
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
     *
     * @param {Event} evt The sclick event.
     */
    function toggle(evt) {
        if (angular.isDefined(evt.target)) {
            _registerSource(angular.element(evt.target));
        }

        if (lxDropdown.isOpen) {
            NglxDropdownService.closeActiveDropdown();
        } else {
            _open();
        }
    }

    /////////////////////////////

    lxDropdown.registerMenu = registerMenu;
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
     * @param {Event}  evt        The dropdown open event.
     * @param {string} dropdownId The dropdown identifier.
     * @param {Object} params     An optional object that holds extra parameters.
     */
    $scope.$on('lx-dropdown__open', (evt, dropdownId, params) => {
        if (dropdownId === lxDropdown.uuid && !lxDropdown.isOpen) {
            registerToggle(angular.element(params.target));

            if (angular.isDefined(params.source)) {
                _registerSource(angular.element(params.source));
            } else {
                _registerSource(angular.element(params.target));
            }

            _open();
        }
    });

    /**
     * Close a given dropdown.
     *
     * @param {Event}  evt        The dropdown open event.
     * @param {Object} dropdownId The dropdown identifier.
     */
    $scope.$on('lx-dropdown__close', (evt, dropdownId) => {
        if (dropdownId === lxDropdown.uuid && lxDropdown.isOpen) {
            _close();
        }
    });

    /**
     * Update the active dropdown position.
     */
    $scope.$on('lx-dropdown__update', () => {
        if (NglxDropdownService.isOpen(lxDropdown.uuid)) {
            _initHorizontalPosition();
            _initVerticalPosition();
        }
    });
}

/////////////////////////////

function lxDropdownDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        ctrl.registerToggle(el.find('.lx-dropdown__toggle'));
        ctrl.registerMenu(el.find('.lx-dropdown__menu'));

        if (transclude.isSlotFilled('toggle')) {
            ctrl.hasToggle = true;
        }

        attrs.$observe('id', (id) => {
            ctrl.uuid = id;
        });
    }

    return {
        bindToController: true,
        controller: lxDropdownController,
        controllerAs: 'lxDropdown',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            closeOnClick: '=?lxCloseOnClick',
            escapeClose: '=?lxEscapeClose',
            offset: '@?lxOffset',
            overToggle: '=?lxOverToggle',
            position: '@?lxPosition',
            width: '@?lxWidth',
        },
        template,
        transclude: {
            menu: `${COMPONENT_PREFIX}DropdownMenu`,
            toggle: `?${COMPONENT_PREFIX}DropdownToggle`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dropdown`).directive(`${COMPONENT_PREFIX}Dropdown`, lxDropdownDirective);

/////////////////////////////

export { lxDropdownDirective };
