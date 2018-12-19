(function IIFE() {
    'use strict';

    /////////////////////////////

    LxNotificationService.$inject = ['$compile', '$rootScope', '$timeout', 'LxDepthService'];

    function LxNotificationService($compile, $rootScope, $timeout, LxDepthService) {
        var service = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The notification delay before hiding.
         *
         * @type {integer}
         */
        var _HIDE_DELAY = 6000;

        /**
         * The notification open transition duration.
         *
         * @type {integer}
         */
        var _TRANSITION_DURATION = 200;

        /**
         * The notification icon and colors according to their type.
         *
         * @type {string}
         */
        var _notificationTypes = {
            error: {
                color: 'red',
                icon: 'alert',
            },
            info: {
                color: 'dark',
                icon: 'information',
            },
            success: {
                color: 'green',
                icon: 'check',
            },
            warning: {
                color: 'yellow',
                icon: 'alert-circle-outline',
            },
        };

        /////////////////////////////
        //                         //
        //    Private functions    //
        //                         //
        /////////////////////////////

        /**
         * Build the notification template.
         *
         * @param  {string} content The notification content.
         * @param  {string} type    The notification type, either info, success, warning or error.
         */
        function _build(content, type) {
            var notification = angular.element('<div/>', {
                class: 'lx-notification lx-notification--color-' + _notificationTypes[type].color,
            });

            var notificationIconWrapper = angular.element('<div/>', {
                class: 'lx-notification__icon',
            });
            var notificationIcon = $compile('<lx-icon lx-id="' + _notificationTypes[type].icon + '" lx-size="m">')($rootScope);

            var notificationText = angular.element('<span/>', {
                class: 'lx-notification__content',
                html: content,
            });

            var notificationHideTimeout;

            LxDepthService.increase();

            notificationIconWrapper.append(notificationIcon);

            notification
                .append(notificationIconWrapper)
                .append(notificationText)
                .css('z-index', LxDepthService.get())
                .appendTo('body')
                .on('click', function onNotificationClick() {
                    _hide(notification);

                    $timeout.cancel(notificationHideTimeout);
                });

            notificationHideTimeout = $timeout(function waitBeforeHiding() {
                _hide(notification);
            }, _HIDE_DELAY);
        }

        /**
         * Hide the given notification
         *
         * @param {Element} notification The notification html element.
         */
        function _hide(notification) {
            notification.addClass('lx-notification--is-hidden');

            $timeout(function waitBeforeDeleting() {
                notification.remove();
            }, _TRANSITION_DURATION);
        }

        /**
         * Check if an existing notification is displayed before building.
         *
         * @param  {string} content The notification content.
         * @param  {string} type    The notification type, either info, success, warning or error.
         */
        function _notify(content, type) {
            var activeNotification = angular.element('.lx-notification');

            if (activeNotification.length) {
                _hide(activeNotification);

                $timeout(function waitBeforeShowingNext() {
                    _build(content, type);
                }, _TRANSITION_DURATION);
            } else {
                _build(content, type);
            }
        }

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Create an error notification.
         *
         * @param {string} content The notification content.
         */
        function error(content) {
            _notify(content, 'error');
        }

        /**
         * Create an info notification.
         *
         * @param {string} content The notification content.
         */
        function info(content) {
            _notify(content, 'info');
        }

        /**
         * Create a success notification.
         *
         * @param {string} content The notification content.
         */
        function success(content) {
            _notify(content, 'success');
        }

        /**
         * Create a warning notification.
         *
         * @param {string} content The notification content.
         */
        function warning(content) {
            _notify(content, 'warning');
        }

        /////////////////////////////

        service.error = error;
        service.info = info;
        service.success = success;
        service.warning = warning;
    }

    /////////////////////////////

    angular.module('lumx.notification').service('LxNotificationService', LxNotificationService);
})();
