(function IIFE() {
    'use strict';

    /////////////////////////////

    lxDropdownController.$inject = ['$document', '$scope', '$timeout', '$window', 'LxDepth', 'LxDropdownService', 'LxUtils'];

    function lxDropdownController($document, $scope, $timeout, $window, LxDepth, LxDropdownService, LxUtils) {
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
         * The menu element.
         *
         * @type {element}
         */
        var _menuEl;

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
        lxDropdown.uuid = LxUtils.generateUUID();

        /////////////////////////////
        //                         //
        //    Private functions    //
        //                         //
        /////////////////////////////

        /**
         * Get available height.
         *
         * @return {Object} Available height on top / bottom.
         */
        function _getAvailableHeight() {
            var availaibleHeight = {};
            var toggleProps = {
                height: _toggleEl.outerHeight(),
                top: _toggleEl.offset().top - angular.element($window).scrollTop(),
            };
            var windowProps = {
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
            var menuProps = {};
            var toggleProps = {
                left: _toggleEl.offset().left,
                height: _toggleEl.outerHeight(),
                width: _toggleEl.outerWidth(),
            };
            var windowProps = {
                height: $window.innerHeight,
                width: $window.innerWidth,
            };

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
            })
        }

        /**
         * Initialize vertical position.
         */
        function _initVerticalPosition() {
            var availaibleHeight = _getAvailableHeight();
            var menuProps = {};
            var windowProps = {
                height: $window.innerHeight,
            };

            if (availaibleHeight.below > availaibleHeight.above) {
                if (lxDropdown.overToggle) {
                    menuProps.top = availaibleHeight.above;
                    menuProps.maxHeight = availaibleHeight.below;
                } else {
                    menuProps.top = availaibleHeight.above + _toggleEl.outerHeight();
                    menuProps.maxHeight = availaibleHeight.below;
                }
            } else {
                if (lxDropdown.overToggle) {
                    menuProps.bottom = windowProps.height - availaibleHeight.above - _toggleEl.outerHeight();
                    menuProps.maxHeight = availaibleHeight.above + _toggleEl.outerHeight();
                } else {
                    menuProps.bottom = windowProps.height - availaibleHeight.above;
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
            close();
        }

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Close dropdown.
         */
        function close() {
            lxDropdown.isOpen = false;

            LxDropdownService.resetActiveDropdownUuid();

            LxUtils.restoreBodyScroll();

            $timeout(function() {
                _menuEl.removeAttr('style').insertAfter(_toggleEl);

                $document.off('click', _onDocumentClick);
            });
        }

        /**
         * Open dropdown.
         */
        function open() {
            LxDropdownService.closeActiveDropdown();
            LxDropdownService.registerActiveDropdownUuid(lxDropdown.uuid);

            LxDepth.increase();

            _menuEl
                .appendTo('body')
                .css('z-index', LxDepth.get());

            $timeout(function() {
                _initHorizontalPosition();
                _initVerticalPosition();

                lxDropdown.isOpen = true;
                LxUtils.disableBodyScroll();

                $document.on('click', _onDocumentClick);
            });
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
            if (lxDropdown.isOpen) {
                close();
            } else {
                open();
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
         * @param {Event}  evt    The dropdown open event.
         * @param {Ovject} params The dropdown uuid and the target id.
         */
        $scope.$on('lx-dropdown__open', function onDropdownOpen(evt, params) {
            if (params.uuid === lxDropdown.uuid && !lxDropdown.isOpen) {
                registerToggle(angular.element(params.target));
                open();
            }
        });

        /**
         * Close a given dropdown.
         *
         * @param {Event}  evt    The dropdown open event.
         * @param {Ovject} params The dropdown uuid.
         */
        $scope.$on('lx-dropdown__close', function(evt, params) {
            if (params.uuid === lxDropdown.uuid && lxDropdown.isOpen) {
                close();
            }
        });
    }

    /////////////////////////////

    function lxDropdownDirective() {
        function link(scope, el, attrs, ctrl) {
            ctrl.registerToggle(el.find('.lx-dropdown__toggle'));
            ctrl.registerMenu(el.find('.lx-dropdown__menu'));

            attrs.$observe('id', function(id) {
                ctrl.uuid = id;
            });
        }

        return {
            bindToController: true,
            controller: lxDropdownController,
            controllerAs: 'lxDropdown',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {
                overToggle: '=?lxOverToggle',
                position: '@?lxPosition',
            },
            templateUrl: 'components/lx-dropdown/dropdown.html',
            transclude: {
                toggle: '?lxDropdownToggle',
                menu: 'lxDropdownMenu',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.dropdown').directive('lxDropdown', lxDropdownDirective);
})();
