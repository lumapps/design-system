import { mdiAlert, mdiAlertCircleOutline, mdiCheck, mdiInformation } from 'LumX/icons';

import { NotificationState } from 'LumX/components/notification/react/NotificationReducer';

/**
 * The notification delay before hiding.
 *
 * @type {number}
 * @constant
 * @readonly
 */
const HIDE_DELAY: number = 6000;

/**
 * Initial state of notification.
 */
const INITIAL_STATE: NotificationState = {
    notifications: [],
};

/**
 * The notification icon and colors according to their type.
 *
 * @type {string}
 */
const NOTIFICATION_CONFIGURATION: {} = {
    error: {
        color: 'red',
        icon: mdiAlert,
    },
    info: {
        color: 'dark',
        icon: mdiInformation,
    },
    success: {
        color: 'green',
        icon: mdiCheck,
    },
    warning: {
        color: 'yellow',
        icon: mdiAlertCircleOutline,
    },
};

/**
 * The notification open transition duration.
 *
 * @type {number}
 * @constant
 * @readonly
 */
const TRANSITION_DURATION: number = 200;

export { HIDE_DELAY, INITIAL_STATE, NOTIFICATION_CONFIGURATION, TRANSITION_DURATION };
