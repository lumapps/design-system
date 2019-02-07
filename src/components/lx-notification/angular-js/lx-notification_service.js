import '../style/lx-notification.scss';

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
         * @param {string}   content          The notification content.
         * @param {string}   type             The notification type, either info, success, warning or error.
         * @param {string}   [actionLabel]    The action button label.
         * @param {Function} [actionCallback] The action button callback function called on action button click.
         */
        function _build(content, type, actionLabel, actionCallback) {
            var notification = angular.element('<div/>', {
                class: 'lx-notification lx-notification--color-' + _notificationTypes[type].color,
            });

            var notificationIconWrapper = angular.element('<div/>', {
                class: 'lx-notification__icon',
            });
            var notificationIcon = $compile(
                '<lx-icon lx-id="' + _notificationTypes[type].icon + '" lx-size="m"></lx-icon>',
            )($rootScope);

            var notificationText = angular.element('<span/>', {
                class: 'lx-notification__content',
                html: content,
            });

            notificationIconWrapper.append(notificationIcon);

            notification.append(notificationIconWrapper).append(notificationText);

            if (angular.isDefined(actionLabel)) {
                notification.addClass('lx-notification--has-action');

                var notificationActionWrapper = angular.element('<div/>', {
                    class: 'lx-notification__action',
                });
                var notificationAction = $compile('<lx-button lx-type="tertiary">' + actionLabel + '</lx-button>')(
                    $rootScope,
                );

                notificationAction.on('click', function onActionCuttonClick(evt) {
                    actionCallback();

                    evt.stopPropagation();
                });

                notificationActionWrapper.append(notificationAction).appendTo(notification);
            }

            var notificationHideTimeout;
            notificationHideTimeout = $timeout(function waitBeforeHiding() {
                _hide(notification);
            }, _HIDE_DELAY);

            LxDepthService.increase();

            notification
                .css('z-index', LxDepthService.get())
                .appendTo('body')
                .on('click', function onNotificationClick() {
                    _hide(notification);

                    $timeout.cancel(notificationHideTimeout);
                });
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
         * @param {string}   content          The notification content.
         * @param {string}   type             The notification type, either info, success, warning or error.
         * @param {string}   [actionLabel]    The action button label.
         * @param {Function} [actionCallback] The action button callback function called on action button click.
         */
        function _notify(content, type, actionLabel, actionCallback) {
            var activeNotification = angular.element('.lx-notification');

            if (activeNotification.length) {
                _hide(activeNotification);

                $timeout(function waitBeforeShowingNext() {
                    _build(content, type, actionLabel, actionCallback);
                }, _TRANSITION_DURATION);
            } else {
                _build(content, type, actionLabel, actionCallback);
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
         * @param {string}   content          The notification content.
         * @param {string}   [actionLabel]    The action button label.
         * @param {Function} [actionCallback] The action button callback function called on action button click.
         */
        function error(content, actionLabel, actionCallback) {
            _notify(content, 'error', actionLabel, actionCallback);
        }

        /**
         * Create an info notification.
         *
         * @param {string}   content          The notification content.
         * @param {string}   [actionLabel]    The action button label.
         * @param {Function} [actionCallback] The action button callback function called on action button click.
         */
        function info(content, actionLabel, actionCallback) {
            _notify(content, 'info', actionLabel, actionCallback);
        }

        /**
         * Create a success notification.
         *
         * @param {string}   content          The notification content.
         * @param {string}   [actionLabel]    The action button label.
         * @param {Function} [actionCallback] The action button callback function called on action button click.
         */
        function success(content, actionLabel, actionCallback) {
            _notify(content, 'success', actionLabel, actionCallback);
        }

        /**
         * Create a warning notification.
         *
         * @param {string}   content          The notification content.
         * @param {string}   [actionLabel]    The action button label.
         * @param {Function} [actionCallback] The action button callback function called on action button click.
         */
        function warning(content, actionLabel, actionCallback) {
            _notify(content, 'warning', actionLabel, actionCallback);
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
