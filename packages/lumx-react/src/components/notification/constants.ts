import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';

/**
 * The notification delay before hiding.
 */
const HIDE_DELAY = 6000;

/**
 * The notification icon and colors according to their type.
 */
const NOTIFICATION_CONFIGURATION = {
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
        icon: mdiCheckCircle,
    },
    warning: {
        color: 'yellow',
        icon: mdiAlertCircle,
    },
};

export { HIDE_DELAY, NOTIFICATION_CONFIGURATION };
