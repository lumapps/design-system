import React, { useEffect, useState } from 'react';

import { IGenericProps } from 'LumX/core/react/utils';

import { HIDE_DELAY } from 'LumX/components/notification/constants';

import { Notification, NotificationProps } from 'LumX/components/notification/react/Notification';
import {
    NotificationAction,
    useNotification,
    useNotificationState,
} from 'LumX/components/notification/react/NotificationProvider';

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
 * @return {React.ReactElement} The component.
 */
const NotificationHandler: React.FC<NotificationHandlerProps> = (): React.ReactElement => {
    const { isOpen, ...props }: NotificationProps = useNotificationState();
    const dispatch: React.Dispatch<NotificationAction> = useNotification();
    const [timer, setTimer]: [
        NodeJS.Timeout | undefined,
        React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>
    ] = useState<NodeJS.Timeout>();

    useEffect(() => {
        if (isOpen) {
            if (timer) {
                clearTimeout(timer);
            }

            setTimer(() =>
                setTimeout(() => {
                    dispatch({ payload: {}, type: 'close' });
                }, HIDE_DELAY),
            );
        }

        return (): void => timer && clearTimeout(timer);
    }, [props.content]);

    return <Notification isOpen={isOpen} {...props} />;
};
/////////////////////////////

export { NotificationHandler };
