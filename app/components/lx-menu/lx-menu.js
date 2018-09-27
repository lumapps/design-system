(function IIFE() {
    'use strict';

    /////////////////////////////

    lxMenuController.$inject = ['$document', '$timeout', '$window', 'LxDepth', 'LxUtils'];

    function lxMenuController($document, $timeout, $window, LxDepth, LxUtils) {
        var lxMenu = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * Offset from the edge of the view port if menu is higher.
         *
         * @type {integer}
         */
        var _OFFSET_FROM_EDGE = 16;

        /**
         * The source element.
         *
         * @type {element}
         */
        var _sourceEl;

        /**
         * The target element.
         *
         * @type {element}
         */
        var _targetEl;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        /**
         * Wether the menu is open or not.
         *
         * @type {boolean}
         */
        lxMenu.isOpen = false;

        /////////////////////////////
        //                         //
        //    Private functions    //
        //                         //
        /////////////////////////////

        /**
         * Get available height
         *
         * @return {Object} Available height on top / bottom.
         */
        function _getAvailableHeight() {
            var availaibleHeight = {};
            var sourceProps = {
                height: _sourceEl.outerHeight(),
                top: _sourceEl.offset().top - angular.element($window).scrollTop(),
            };
            var windowProps = {
                height: $window.innerHeight,
            };

            if (lxMenu.overSource) {
                availaibleHeight.above = sourceProps.top;
                availaibleHeight.below = windowProps.height - sourceProps.top;
            } else {
                availaibleHeight.above = sourceProps.top;
                availaibleHeight.below = windowProps.height - (sourceProps.top + sourceProps.height);
            }

            return availaibleHeight;
        }

        /**
         * Initialize horizontal position.
         */
        function _initHorizontalPosition() {
            var sourceProps = {
                left: _sourceEl.offset().left,
                height: _sourceEl.outerHeight(),
                width: _sourceEl.outerWidth(),
            };
            var targetProps = {};
            var windowProps = {
                height: $window.innerHeight,
                width: $window.innerWidth,
            };

            if (lxMenu.position === 'left') {
                targetProps.left = sourceProps.left;
                targetProps.right = 'auto';
            } else if (lxMenu.position === 'right') {
                targetProps.left = 'auto';
                targetProps.right = windowProps.width - sourceProps.width - sourceProps.left;
            }

            _targetEl.css({
                left: targetProps.left,
                right: targetProps.right,
            })
        }

        /**
         * Initialize vertical position.
         */
        function _initVerticalPosition() {
            var availaibleHeight = _getAvailableHeight();
            var targetProps = {};
            var windowProps = {
                height: $window.innerHeight,
            };

            if (availaibleHeight.below > availaibleHeight.above) {
                if (lxMenu.overSource) {
                    targetProps.top = availaibleHeight.above;
                    targetProps.maxHeight = availaibleHeight.below;
                } else {
                    targetProps.top = availaibleHeight.above + _sourceEl.outerHeight();
                    targetProps.maxHeight = availaibleHeight.below;
                }
            } else {
                if (lxMenu.overSource) {
                    targetProps.bottom = windowProps.height - availaibleHeight.above - _sourceEl.outerHeight();
                    targetProps.maxHeight = availaibleHeight.above + _sourceEl.outerHeight();
                } else {
                    targetProps.bottom = windowProps.height - availaibleHeight.above;
                    targetProps.maxHeight = availaibleHeight.above;
                }
            }

            targetProps.maxHeight -= _OFFSET_FROM_EDGE;

            _targetEl.css(targetProps);
        }

        /**
         * Close menu on document clickn.
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
         * Close menu.
         */
        function close() {
            lxMenu.isOpen = false;
            LxUtils.restoreBodyScroll();

            $timeout(function() {
                _targetEl.removeAttr('style').insertAfter(_sourceEl);

                $document.off('click', _onDocumentClick);
            });
        }

        /**
         * Open menu.
         */
        function open() {
            LxDepth.increase();

            _targetEl
                .appendTo('body')
                .css('z-index', LxDepth.get());

            $timeout(function() {
                _initHorizontalPosition();
                _initVerticalPosition();

                lxMenu.isOpen = true;
                LxUtils.disableBodyScroll();

                $document.on('click', _onDocumentClick);
            });
        }

        /**
         * Register elements.
         *
         * @param {element} sourceEl The source element.
         * @param {element} sourceEl The target element.
         */
        function registerElements(sourceEl, targetEl) {
            _sourceEl = sourceEl;
            _targetEl = targetEl;
        }

        /**
         * Toggle the menu on source click.
         */
        function toggle() {
            if (lxMenu.isOpen) {
                close();
            } else {
                open();
            }
        }

        /////////////////////////////

        lxMenu.registerElements = registerElements;
        lxMenu.toggle = toggle;
    }

    /////////////////////////////

    function lxMenuDirective() {
        function link(scope, el, attrs, ctrl) {
            ctrl.registerElements(el.find('.lx-menu__source'), el.find('.lx-menu__target'));
        }

        return {
            bindToController: true,
            controller: lxMenuController,
            controllerAs: 'lxMenu',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {
                overSource: '=?lxOverSource',
                position: '@?lxPosition',
            },
            templateUrl: 'components/lx-menu/menu.html',
            transclude: {
                source: '?lxMenuSource',
                target: '?lxMenuTarget',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.menu').directive('lxMenu', lxMenuDirective);
})();
