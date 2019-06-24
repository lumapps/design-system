import React, { createContext, useContext, useReducer } from 'react';

import { IGenericProps } from 'LumX/core/react/utils';

import { INITIAL_STATE } from 'LumX/components/notification/constants';
import { NotificationHandler } from 'LumX/components/notification/react/NotificationHandler';

import {
    NotificationAction,
    NotificationState,
    notificationReducer,
} from 'LumX/components/notification/react/NotificationReducer';

/////////////////////////////

/**
 * React context of notification.
 */
const stateCtx: React.Context<NotificationState> = createContext(INITIAL_STATE);

/**
 * State dispatcher.
 */
const dispatchCtx: React.Context<React.Dispatch<NotificationAction>> = createContext(((): number =>
    0) as React.Dispatch<NotificationAction>);

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
    const [state, dispatch]: [NotificationState, React.Dispatch<NotificationAction>] = useReducer(
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
 * @return {NotificationState} Properties of current notification's state.
 */
const useNotificationState: () => NotificationState = (): NotificationState => {
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
