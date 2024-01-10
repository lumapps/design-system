import React from 'react';

export type NotificationStackContextValue = {
    register(newNotification: HTMLElement): void;
    unregister(newNotification: HTMLElement): void;
};

/** */
export const NotificationStackContext = React.createContext<NotificationStackContextValue | null>(null);

/** */
export const useNotificationStackContext = () => React.useContext(NotificationStackContext);
