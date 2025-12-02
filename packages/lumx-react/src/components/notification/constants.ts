import { mdiAlert } from '@lumx/icons/esm/alert';
import { mdiAlertCircle } from '@lumx/icons/esm/alert-circle';
import { mdiCheckCircle } from '@lumx/icons/esm/check-circle';
import { mdiInformation } from '@lumx/icons/esm/information';

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
        color: 'blue',
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
