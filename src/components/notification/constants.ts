import { mdiAlert, mdiAlertCircleOutline, mdiCheck, mdiInformation } from 'LumX/icons';

/**
 * The notification delay before hiding.
 */
const HIDE_DELAY = 6000;

/**
 * The notification icon and colors according to their type.
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
 */
const TRANSITION_DURATION = 200;

export { HIDE_DELAY, NOTIFICATION_CONFIGURATION, TRANSITION_DURATION };
