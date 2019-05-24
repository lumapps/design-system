import React, { useContext } from 'react';

import { IGenericProps } from 'LumX/core/react/utils';

import { Notification } from './Notification';
import { NotificationState, notificationContext } from './types';

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
export const NotificationHandler: React.FC<NotificationHandlerProps> = (): React.ReactElement => {
    const { isOpen, props }: NotificationState = useContext(notificationContext);

    return <>{isOpen && <Notification {...props} />}</>;
};
/////////////////////////////
