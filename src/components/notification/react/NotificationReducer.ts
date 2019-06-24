import { NotificationType, NotificationTypes, Theme } from 'LumX/components/notification/react/NotificationBar';

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
 * @param  {NotificationState}  notificationState Notification state.
 * @param  {NotificationAction} notificationAction Notification action.
 * @return {NotificationState}  notificationState Notification state.
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
                notifications: [...notifications, { ...payload, type: NotificationTypes.error }],
            };
        case 'info':
            return {
                notifications: [...notifications, { ...payload, type: NotificationTypes.info }],
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
