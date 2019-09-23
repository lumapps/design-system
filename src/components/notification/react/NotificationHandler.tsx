import React, { useEffect, useState } from 'react';

import { IGenericProps } from 'LumX/core/react/utils';

import { HIDE_DELAY, TRANSITION_DURATION } from 'LumX/components/notification/constants';

import { NotificationBar } from 'LumX/components/notification/react/NotificationBar';
import {
    NotificationAction,
    useNotification,
    useNotificationState,
} from 'LumX/components/notification/react/NotificationProvider';
import { NotificationState } from 'LumX/components/notification/react/NotificationReducer';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface INotificationHandlerProps extends IGenericProps {}
type NotificationHandlerProps = INotificationHandlerProps;

/////////////////////////////

/**
 * Notification handler.
 *
 * @return The component.
 */
const NotificationHandler: React.FC<NotificationHandlerProps> = (): React.ReactElement => {
    const { notifications }: NotificationState = useNotificationState();
    const dispatch: React.Dispatch<NotificationAction> = useNotification();
    const [timer, setTimer]: [
        NodeJS.Timeout | undefined,
        React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>
    ] = useState<NodeJS.Timeout>();
    const isOpen: boolean = notifications.length === 1;

    useEffect(() => {
        if (notifications.length > 1) {
            setTimeout(() => {
                dispatch({ type: 'close' });
            }, TRANSITION_DURATION);
        }

        if (isOpen) {
            if (timer) {
                clearTimeout(timer);
            }

            setTimer(() =>
                setTimeout(() => {
                    dispatch({ type: 'close' });
                }, HIDE_DELAY),
            );
        }

        return (): void => timer && clearTimeout(timer);
    }, [notifications]);

    return <NotificationBar isOpen={isOpen} {...notifications[0]} />;
};
/////////////////////////////

export { NotificationHandler };
