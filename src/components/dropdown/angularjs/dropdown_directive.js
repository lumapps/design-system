import { CSS_PREFIX, ESCAPE_KEY_CODE } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './dropdown.html';

/////////////////////////////

function DropdownController(
    $document,
    $scope,
    $timeout,
    $window,
    LumXDepthService,
    LumXDropdownService,
    LumXEventSchedulerService,
    LumXUtilsService,
) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

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
    lumx.hasToggle = false;

    /**
     * Whether the dropdown is open or not.
     *
     * @type {boolean}
     */
    lumx.isOpen = false;

    /**
     * The dropdown uuid.
     *
     * @type {string}
     */
    lumx.uuid = LumXUtilsService.generateUUID();

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Close dropdown on document click.
     */
    function _onDocumentClick() {
        if (angular.isUndefined(lumx.closeOnClick) || lumx.closeOnClick) {
            LumXDropdownService.closeActiveDropdown();
        }
    }

    /**
     * Close dropdown.
     */
    function _close() {
        lumx.isOpen = false;

        LumXDropdownService.resetActiveDropdownId();

        LumXUtilsService.restoreBodyScroll();

        $timeout(() => {
            _menuEl.removeAttr('style').insertAfter(_toggleEl);

            if (angular.isUndefined(lumx.escapeClose) || lumx.escapeClose) {
                LumXEventSchedulerService.unregister(_idEventScheduler);
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

        if (lumx.overToggle) {
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

        if (angular.isDefined(lumx.width)) {
            if (lumx.width.indexOf('%') > -1) {
                // eslint-disable-next-line no-magic-numbers
                menuProps.minWidth = toggleProps.width * (lumx.width.slice(0, -1) / 100);
            } else {
                menuProps.width = lumx.width;
            }
        } else {
            menuProps.width = 'auto';
        }

        if (lumx.position === 'left') {
            menuProps.left = toggleProps.left;
            menuProps.right = 'auto';
        } else if (lumx.position === 'right') {
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
            if (lumx.overToggle) {
                menuProps.top = availaibleHeight.above;
                menuProps.maxHeight = availaibleHeight.below;
            } else {
                // eslint-disable-next-line no-bitwise
                menuProps.top = availaibleHeight.above + _toggleEl.outerHeight() + ~~lumx.offset;
                menuProps.maxHeight = availaibleHeight.below;
            }
        } else if (lumx.overToggle) {
            menuProps.bottom = windowProps.height - availaibleHeight.above - _toggleEl.outerHeight();
            menuProps.maxHeight = availaibleHeight.above + _toggleEl.outerHeight();
        } else {
            // eslint-disable-next-line no-bitwise
            menuProps.bottom = windowProps.height - availaibleHeight.above + ~~lumx.offset;
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
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            LumXDropdownService.closeActiveDropdown();
        }

        evt.stopPropagation();
    }

    /**
     * Open dropdown.
     */
    function _open() {
        LumXDropdownService.closeActiveDropdown();
        LumXDropdownService.registerActiveDropdownId(lumx.uuid);

        if (angular.isUndefined(lumx.escapeClose) || lumx.escapeClose) {
            _idEventScheduler = LumXEventSchedulerService.register('keyup', _onKeyUp);
        }

        LumXDepthService.increase();

        _menuEl.appendTo('body').css('z-index', LumXDepthService.get());

        $timeout(() => {
            _initHorizontalPosition();
            _initVerticalPosition();

            lumx.isOpen = true;
            LumXUtilsService.disableBodyScroll();

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

        if (lumx.isOpen) {
            LumXDropdownService.closeActiveDropdown();
        } else {
            _open();
        }
    }

    /////////////////////////////

    lumx.registerMenu = registerMenu;
    lumx.registerToggle = registerToggle;
    lumx.toggle = toggle;

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
    $scope.$on(`${COMPONENT_PREFIX}-dropdown__open`, (evt, dropdownId, params) => {
        if (dropdownId === lumx.uuid && !lumx.isOpen) {
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
    $scope.$on(`${COMPONENT_PREFIX}-dropdown__close`, (evt, dropdownId) => {
        if (dropdownId === lumx.uuid && lumx.isOpen) {
            _close();
        }
    });

    /**
     * Update the active dropdown position.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dropdown__update`, () => {
        if (LumXDropdownService.isOpen(lumx.uuid)) {
            _initHorizontalPosition();
            _initVerticalPosition();
        }
    });
}

/////////////////////////////

function DropdownDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        ctrl.registerToggle(el.find(`.${CSS_PREFIX}-dropdown__toggle`));
        ctrl.registerMenu(el.find(`.${CSS_PREFIX}-dropdown__menu`));

        if (transclude.isSlotFilled('toggle')) {
            ctrl.hasToggle = true;
        }

        attrs.$observe('id', (id) => {
            ctrl.uuid = id;
        });
    }

    return {
        bindToController: true,
        controller: DropdownController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            closeOnClick: '=?lumxCloseOnClick',
            escapeClose: '=?lumxEscapeClose',
            offset: '@?lumxOffset',
            overToggle: '=?lumxOverToggle',
            position: '@?lumxPosition',
            width: '@?lumxWidth',
        },
        template,
        transclude: {
            menu: `${COMPONENT_PREFIX}DropdownMenu`,
            toggle: `?${COMPONENT_PREFIX}DropdownToggle`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dropdown`).directive(`${COMPONENT_PREFIX}Dropdown`, DropdownDirective);

/////////////////////////////

export { DropdownDirective };
