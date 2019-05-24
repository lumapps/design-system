import React from 'react';

import { NotificationProps } from 'LumX';

/**
 * Different types of notification.
 */
const enum NotificationTypes {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
}
type NotificationType = NotificationTypes;

/**
 * State of notification.
 */
interface INotificationState {
    isOpen?: boolean;
    props: NotificationProps;
    open(props: NotificationProps): void;
    error(props: NotificationProps): void;
    info(props: NotificationProps): void;
    success(props: NotificationProps): void;
    warning(props: NotificationProps): void;
}
type NotificationState = INotificationState;

/**
 * Initial state of notification.
 */
const INITIAL_STATE: NotificationState = {
    isOpen: false,
    props: {
        content: <span />,
    },
    open(): void {
        // Not empty.
    },
    error(): void {
        // Not empty.
    },
    info(): void {
        // Not empty.
    },
    success(): void {
        // Not empty.
    },
    warning(): void {
        // Not empty.
    },
};

/**
 * React context of notification.
 */
const notificationContext: React.Context<INotificationState> = React.createContext(INITIAL_STATE);

export { INITIAL_STATE, NotificationType, NotificationTypes, NotificationState, notificationContext };
