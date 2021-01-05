import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';

/**
 * Notification delay before hiding.
 */
export const HIDE_DELAY = 6000;

/**
 * Notification icon and colors according to their type.
 */
export const NOTIFICATION_CONFIGURATION = {
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
