import { NotificationProps, NotificationTypes } from 'LumX/components/notification/react/Notification';

type NotificationActionType = 'open' | 'close' | 'error' | 'info' | 'success' | 'warning';

interface INotificationAction {
    type: NotificationActionType;
    payload: NotificationProps;
}

type NotificationAction = INotificationAction;

function notificationReducer(state: NotificationProps, action: NotificationAction): NotificationProps {
    switch (action.type) {
        case 'open':
            return { ...action.payload, isOpen: true };
        case 'close':
            return { ...state, isOpen: false };
        case 'error':
            return { ...action.payload, isOpen: true, type: NotificationTypes.error };
        case 'info':
            return { ...action.payload, isOpen: true, type: NotificationTypes.info };
        case 'success':
            return { ...action.payload, isOpen: true, type: NotificationTypes.success };
        case 'warning':
            return { ...action.payload, isOpen: true, type: NotificationTypes.warning };

        default:
            throw new Error();
    }
}

export { notificationReducer, NotificationAction, NotificationActionType };
