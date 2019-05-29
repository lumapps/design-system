import React, { createContext, useContext, useReducer } from 'react';

import { IGenericProps } from 'LumX/core/react/utils';

import { INITIAL_STATE } from 'LumX/components/notification/constants';
import { NotificationProps } from 'LumX/components/notification/react/Notification';
import { NotificationHandler } from 'LumX/components/notification/react/NotificationHandler';

import { NotificationAction, notificationReducer } from './NotificationReducer';

/////////////////////////////

/**
 * React context of notification.
 */
// Const notificationContext: React.Context<INotificationState> = React.createContext(INITIAL_STATE);

const stateCtx: React.Context<NotificationProps> = createContext(INITIAL_STATE);
const dispatchCtx: React.Context<React.Dispatch<NotificationAction>> = createContext((() => 0) as React.Dispatch<
    NotificationAction
>);

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
    const [state, dispatch]: [NotificationProps, React.Dispatch<NotificationAction>] = useReducer(
        notificationReducer,
        INITIAL_STATE,
    );

    return (
        <dispatchCtx.Provider value={dispatch}>
            <stateCtx.Provider value={state}>
                {children}
                <NotificationHandler />
            </stateCtx.Provider>
        </dispatchCtx.Provider>
    );
};

/**
 * Custom hook to get the current state of the notification.
 *
 * @return {NotificationProps} Properties of current notification's state.
 */
const useNotificationState: () => NotificationProps = (): NotificationProps => {
    return useContext(stateCtx);
};

/**
 * Custom hook to dispatch actions to notification's reducer.
 *
 * @return {React.Dispatch<NotificationAction>} Dispatcher.
 */
const useNotification: () => React.Dispatch<NotificationAction> = (): React.Dispatch<NotificationAction> => {
    return useContext(dispatchCtx);
};

/////////////////////////////

export { NotificationAction, NotificationProvider, useNotification, useNotificationState };
