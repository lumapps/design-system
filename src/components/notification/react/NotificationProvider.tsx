import React, { useState } from 'react';

import { IGenericProps } from 'LumX/core/react/utils';

import { INITIAL_STATE } from 'LumX/components/notification/constants';
import { NotificationProps, NotificationTypes } from 'LumX/components/notification/react/Notification';
import { NotificationHandler } from 'LumX/components/notification/react/NotificationHandler';

/////////////////////////////

/**
 * State of notification.
 */
interface INotificationState {
    props: NotificationProps;
    close(): void;
    open(props: NotificationProps): void;
    error(props: NotificationProps): void;
    info(props: NotificationProps): void;
    success(props: NotificationProps): void;
    warning(props: NotificationProps): void;
}
type NotificationState = INotificationState;

/**
 * React context of notification.
 */
const notificationContext: React.Context<INotificationState> = React.createContext(INITIAL_STATE);

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface INotificationProviderProps extends IGenericProps {}
type NotificationProviderProps = INotificationProviderProps;

/////////////////////////////

/**
 * Notification context provider.
 *
 * @return {React.ReactElement} The component.
 */
const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}: NotificationProviderProps): React.ReactElement => {
    const [notificationState, setNotificationState]: [
        NotificationState,
        React.Dispatch<React.SetStateAction<NotificationState>>
    ] = useState<NotificationState>({
        ...INITIAL_STATE,
        close: (): void =>
            setNotificationState((notification: NotificationState) => ({
                ...notification,
                props: { ...notification.props, isOpen: false },
            })),
        error: (update: NotificationProps): void =>
            setNotificationState((notification: NotificationState) => ({
                ...notification,
                props: { ...update, isOpen: true, type: NotificationTypes.error },
            })),
        info: (update: NotificationProps): void =>
            setNotificationState((notification: NotificationState) => ({
                ...notification,
                props: { ...update, isOpen: true, type: NotificationTypes.info },
            })),
        open: (update: NotificationProps): void =>
            setNotificationState((notification: NotificationState) => ({
                ...notification,
                props: { ...update, isOpen: true },
            })),
        success: (update: NotificationProps): void =>
            setNotificationState((notification: NotificationState) => ({
                ...notification,
                props: { ...update, isOpen: true, type: NotificationTypes.success },
            })),
        warning: (update: NotificationProps): void =>
            setNotificationState((notification: NotificationState) => ({
                ...notification,
                props: { ...update, isOpen: true, type: NotificationTypes.warning },
            })),
    });

    return (
        <notificationContext.Provider value={notificationState}>
            {children}
            <NotificationHandler />
        </notificationContext.Provider>
    );
};

/////////////////////////////

export { NotificationState, notificationContext, NotificationProvider };
