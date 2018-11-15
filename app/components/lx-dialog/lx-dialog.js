(function IIFE() {
    'use strict';

    /////////////////////////////

    lxDialogController.$inject = ['$element', '$rootScope', '$scope', '$timeout', 'LxDepthService',
        'LxEventSchedulerService'];

    function lxDialogController($element, $rootScope, $scope, $timeout, LxDepthService,
        LxEventSchedulerService) {
        var lxDialog = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The dialog open/close transition duration.
         *
         * @type {integer}
         */
        var _TRANSITION_DURATION = 400;

        /**
         * The dialog.
         *
         * @type {Element}
         */
        var _dialog = $element;

        /**
         * The dialog content.
         *
         * @type {Element}
         */
        var _dialogContent;

        /**
         * The dialog black filter.
         *
         * @type {Element}
         */
        var _dialogFilter = angular.element('<div/>', {
            class: 'lx-dialog-filter'
        });

        /**
         * The event scheduler id.
         *
         * @type {string}
         */
        var _idEventScheduler;

        /**
         * The dialog parent element.
         *
         * @type {Element}
         */
        var _parentElement = _dialog.parent();

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        /**
         * The dialog identifier.
         *
         * @type {string}
         */
        lxDialog.id = undefined;

        /**
         * Wether the dialog is open or not.
         *
         * @type {boolean}
         */
        lxDialog.isOpen = false;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Check if user srcolls to the ind of the dialog content.
         */
        function _checkScrollEnd() {
            if (_dialogContent.scrollTop() + _dialogContent.innerHeight() < _dialogContent[0].scrollHeight) {
                return;
            }

            $rootScope.$broadcast('lx-dialog__scroll-end', lxDialog.id);

            _dialogContent.off('scroll', _checkScrollEnd);

            $timeout(function waitBeforeCheckingScrollAgain() {
                _dialogContent.on('scroll', _checkScrollEnd);
            }, 500);
        }

        /**
         * Close the current dialog.
         *
         * @param {boolean} canceled Wether the dialog is closed via a cancel or not.
         * @param {Object}  params   An optional object that holds extra parameters.
         */
        function _close(canceled, params) {
            if (!lxDialog.isOpen) {
                return;
            }

            params = params || {};

            if (angular.isDefined(_idEventScheduler)) {
                LxEventSchedulerService.unregister(_idEventScheduler);
                _idEventScheduler = undefined;
            }

            $rootScope.$broadcast('lx-dialog__close-start', lxDialog.id, canceled, params);

            _dialog.removeClass('lx-dialog--is-shown');
            _dialogFilter.removeClass('lx-dialog-filter--is-shown');

            $timeout(function onDialogCloseEnd() {
                _dialog.hide().appendTo(_parentElement);
                _dialogFilter.remove();

                lxDialog.isOpen = false;

                $rootScope.$broadcast('lx-dialog__close-end', lxDialog.id, canceled, params);
            }, _TRANSITION_DURATION);
        }

        /**
         * Close dialog on echap key up.
         *
         * @param {Event} evt The key up event.
         */
        function _onKeyUp(evt) {
            if (evt.keyCode == 27) {
                _close(true);
            }

            evt.stopPropagation();
        }

        /**
         * Open the current dialog.
         *
         * @param {Object} params An optional object that holds extra parameters.
         */
        function _open(params) {
            if (lxDialog.isOpen) {
                return;
            }

            LxDepthService.increase();

            _dialogFilter
                .css('z-index', LxDepthService.get())
                .appendTo('body');

            if (angular.isUndefined(lxDialog.autoClose) || lxDialog.autoClose) {
                _dialogFilter.on('click', function() {
                    _close(true);
                });
            }

            if (angular.isUndefined(lxDialog.escapeClose) || lxDialog.escapeClose) {
                _idEventScheduler = LxEventSchedulerService.register('keyup', _onKeyUp);
            }

            _dialog
                .css('z-index', LxDepthService.get() + 1)
                .appendTo('body')
                .show();

            $timeout(function onDialogOpenStart() {
                $rootScope.$broadcast('lx-dialog__open-start', lxDialog.id, params);

                lxDialog.isOpen = true;

                _dialog.addClass('lx-dialog--is-shown');
                _dialogFilter.addClass('lx-dialog-filter--is-shown');

                $timeout(function onDialogContentDisplay() {
                    _dialogContent = _dialog.find('.lx-dialog__content');
                    _dialogContent.on('scroll', _checkScrollEnd);
                });
            });

            $timeout(function onDialogOpenEnd() {
                $rootScope.$broadcast('lx-dialog__open-end', lxDialog.id, params);
            }, _TRANSITION_DURATION);
        }

        /////////////////////////////
        //                         //
        //          Events         //
        //                         //
        /////////////////////////////

        /**
         * Open a given dialog.
         *
         * @param {Event}  evt      The dropdown open event.
         * @param {string} dialogId The dialog identifier.
         * @param {Object} params   An optional object that holds extra parameters.
         */
        $scope.$on('lx-dialog__open', function(evt, dialogId, params) {
            if (dialogId === lxDialog.id) {
                _open(params);
            }
        });
    }

    /////////////////////////////

    function lxDialogDirective() {
        function link(scope, el, attrs, ctrl) {
            attrs.$observe('id', function(newId) {
                ctrl.id = newId;
            });
        }

        return {
            bindToController: true,
            controller: lxDialogController,
            controllerAs: 'lxDialog',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {
                autoClose: '=?lxAutoClose',
                escapeClose: '=?lxEscapeClose',
            },
            templateUrl: 'components/lx-dialog/lx-dialog.html',
            transclude: {
                content: 'lxDialogContent',
                footer: '?lxDialogFooter',
                header: '?lxDialogHeader',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.dialog').directive('lxDialog', lxDialogDirective);
})();
