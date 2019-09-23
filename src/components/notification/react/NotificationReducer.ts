import { NotificationType, Theme } from 'LumX';

/** Action types of the notification reducer. */
type NotificationActionType = 'open' | 'close' | 'error' | 'info' | 'success' | 'warning';

/** Notification properties passed by design system's consumer. */

interface INotification {
    /** Label for action button. */
    actionLabel?: string;

    /** Content of notification. */
    content?: React.ReactNode;

    /* * Theme. */
    theme?: Theme;

    /** Type of notification (info, success, warning, error). */
    type?: NotificationType;

    /** Callback function for action button. */
    actionCallback?(): void;

    /** Function to handle click on the notification. */
    handleClick?(): void;
}

type Notification = INotification;

/** State of the notification reducer. */
interface INotificationState {
    /** Queue of notifications. */
    notifications: Notification[];
}

type NotificationState = INotificationState;

/** Action object of the notification reducer. */
interface INotificationAction {
    type: NotificationActionType;
    payload?: Notification;
}

type NotificationAction = INotificationAction;

/**
 * Notification reducer.
 *
 * @param  notificationState Notification state.
 * @param  notificationAction Notification action.
 * @return notificationState Notification state.
 */
function notificationReducer(
    { notifications }: NotificationState,
    { type, payload }: NotificationAction,
): NotificationState {
    switch (type) {
        case 'close':
            notifications.shift();

            return {
                notifications: [...notifications],
            };
        case 'error':
            return {
                notifications: [...notifications, { ...payload, type: NotificationType.error }],
            };
        case 'info':
            return {
                notifications: [...notifications, { ...payload, type: NotificationType.info }],
            };
        case 'success':
            return {
                notifications: [...notifications, { ...payload, type: NotificationTypes.success }],
            };
        case 'warning':
            return {
                notifications: [...notifications, { ...payload, type: NotificationTypes.warning }],
            };

        default:
            throw new Error();
    }
}

export { notificationReducer, NotificationAction, NotificationState, NotificationActionType };
