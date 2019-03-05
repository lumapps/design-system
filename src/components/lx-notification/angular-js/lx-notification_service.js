import { MODULE_NAME } from '@lumx/angularjs/lumx'

import { mdiAlert, mdiAlertCircleOutline, mdiCheck, mdiInformation } from '@lumx/icons';

import '../style/lx-notification.scss';

/////////////////////////////

function LxNotificationService($compile, $rootScope, $timeout, LxDepthService) {
    const service = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The notification delay before hiding.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _HIDE_DELAY = 6000;

    /**
     * The notification open transition duration.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _TRANSITION_DURATION = 200;

    /**
     * The notification icon and colors according to their type.
     *
     * @type {string}
     */
    const _notificationTypes = {
        errorNotification: {
            color: 'red',
            icon: mdiAlert,
        },
        infoNotification: {
            color: 'dark',
            icon: mdiInformation,
        },
        successNotification: {
            color: 'green',
            icon: mdiCheck,
        },
        warningNotification: {
            color: 'yellow',
            icon: mdiAlertCircleOutline,
        },
    };

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Hide the given notification.
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
     * Build the notification template.
     *
     * @param {string}   content          The notification content.
     * @param {string}   type             The notification type, either info, success, warning or error.
     * @param {string}   [actionLabel]    The action button label.
     * @param {Function} [actionCallback] The action button callback function called on action button click.
     */
    function _build(content, type, actionLabel, actionCallback) {
        const notification = angular.element('<div/>', {
            class: `lx-notification lx-notification--color-${_notificationTypes[type].color}`,
        });

        const notificationIconWrapper = angular.element('<div/>', {
            class: 'lx-notification__icon',
        });
        const notificationIcon = $compile(`<lx-icon lx-path="${_notificationTypes[type].icon}" lx-size="s"></lx-icon>`)(
            $rootScope,
        );

        const notificationText = angular.element('<span/>', {
            class: 'lx-notification__content',
            html: content,
        });

        notificationIconWrapper.append(notificationIcon);

        notification.append(notificationIconWrapper).append(notificationText);

        if (angular.isDefined(actionLabel)) {
            notification.addClass('lx-notification--has-action');

            const notificationActionWrapper = angular.element('<div/>', {
                class: 'lx-notification__action',
            });
            const notificationAction = $compile(`<lx-button lx-emphasis="medium">${actionLabel}</lx-button>`)(
                $rootScope,
            );

            notificationAction.on('click', function onActionCuttonClick(evt) {
                actionCallback();

                evt.stopPropagation();
            });

            notificationActionWrapper.append(notificationAction).appendTo(notification);
        }

        const notificationHideTimeout = $timeout(function waitBeforeHiding() {
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
     * Check if an existing notification is displayed before building.
     *
     * @param {string}   content          The notification content.
     * @param {string}   type             The notification type, either info, success, warning or error.
     * @param {string}   [actionLabel]    The action button label.
     * @param {Function} [actionCallback] The action button callback function called on action button click.
     */
    function _notify(content, type, actionLabel, actionCallback) {
        const activeNotification = angular.element('.lx-notification');

        if (activeNotification.length > 0) {
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
    function errorNotification(content, actionLabel, actionCallback) {
        _notify(content, 'errorNotification', actionLabel, actionCallback);
    }

    /**
     * Create an info notification.
     *
     * @param {string}   content          The notification content.
     * @param {string}   [actionLabel]    The action button label.
     * @param {Function} [actionCallback] The action button callback function called on action button click.
     */
    function infoNotification(content, actionLabel, actionCallback) {
        _notify(content, 'infoNotification', actionLabel, actionCallback);
    }

    /**
     * Create a success notification.
     *
     * @param {string}   content          The notification content.
     * @param {string}   [actionLabel]    The action button label.
     * @param {Function} [actionCallback] The action button callback function called on action button click.
     */
    function successNotification(content, actionLabel, actionCallback) {
        _notify(content, 'successNotification', actionLabel, actionCallback);
    }

    /**
     * Create a warning notification.
     *
     * @param {string}   content          The notification content.
     * @param {string}   [actionLabel]    The action button label.
     * @param {Function} [actionCallback] The action button callback function called on action button click.
     */
    function warningNotification(content, actionLabel, actionCallback) {
        _notify(content, 'warningNotification', actionLabel, actionCallback);
    }

    /////////////////////////////

    // eslint-disable-next-line id-blacklist
    service.error = errorNotification;
    service.info = infoNotification;
    service.success = successNotification;
    service.warning = warningNotification;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.notification`).service('LxNotificationService', LxNotificationService);

/////////////////////////////

export { LxNotificationService };
