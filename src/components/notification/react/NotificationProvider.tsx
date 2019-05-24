import React, { useState } from 'react';

import { IGenericProps } from 'LumX/core/react/utils';

import { NotificationProps } from './Notification';
import { NotificationHandler } from './NotificationHandler';
import { INITIAL_STATE, NotificationState, NotificationTypes, notificationContext } from './types';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface INotificationProviderProps extends IGenericProps {}
type NotificationProviderProps = INotificationProviderProps;

/////////////////////////////

/**
 * Notification context provider
 *
 * @return {React.ReactElement} The component
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}: NotificationProviderProps): React.ReactElement => {
    const [notificationState, setNotificationState]: [
        NotificationState,
        React.Dispatch<React.SetStateAction<NotificationState>>
    ] = useState<NotificationState>({
        ...INITIAL_STATE,
        error: (update: NotificationProps): void => updateNotificationState(update, NotificationTypes.error),
        info: (update: NotificationProps): void => updateNotificationState(update, NotificationTypes.info),
        open: (update: NotificationProps): void => updateNotificationState(update),
        success: (update: NotificationProps): void => updateNotificationState(update, NotificationTypes.success),
        warning: (update: NotificationProps): void => updateNotificationState(update, NotificationTypes.warning),
    });

    /**
     * Update the notification state.
     *
     * @param {NotificationProps} update Properties to update.
     * @param {NotificationTypes} [type] Type of the notification.
     */
    const updateNotificationState: (update: NotificationProps, type?: NotificationTypes) => void = (
        update: NotificationProps,
        type?: NotificationTypes,
    ): void => {
        setNotificationState((notification: NotificationState) => ({
            ...notification,
            isOpen: true,
            props: type !== undefined ? { ...update, type } : { ...update },
        }));
    };

    return (
        <notificationContext.Provider value={notificationState}>
            {children}
            <NotificationHandler />
        </notificationContext.Provider>
    );
};
