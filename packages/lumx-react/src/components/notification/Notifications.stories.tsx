import React from 'react';

import { Button, Notification, NotificationType } from '@lumx/react';

import noop from 'lodash/noop';

export default { title: 'LumX components/notification/Notification' };

const properties = {
    error: {
        content: 'Error',
        onClick: noop,
        isOpen: true,
        type: NotificationType.error,
    },
    info: {
        content: 'Info',
        onClick: noop,
        isOpen: true,
        type: NotificationType.info,
    },
    infoWithCallback: {
        onActionClick: noop,
        actionLabel: 'Undo',
        content: 'Info with callback',
        onClick: noop,
        isOpen: true,
        type: NotificationType.info,
    },
    success: {
        content: 'Success',
        onClick: noop,
        isOpen: true,
        type: NotificationType.success,
    },

    warning: {
        content: 'Warning',
        onClick: noop,
        isOpen: true,
        type: NotificationType.warning,
    },
};

export const error = () => <Notification {...properties.error} />;

export const info = () => <Notification {...properties.info} />;

export const infoWithCallback = () => <Notification {...properties.infoWithCallback} />;

export const success = () => <Notification {...properties.success} />;

export const warning = () => <Notification {...properties.warning} />;

export const onTrigger = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const onClick = () => setIsOpen(!isOpen);

    return [
        <Button onClick={onClick}>{!isOpen ? 'Show Notification' : 'Close Notification'}</Button>,
        <Notification {...properties.error} isOpen={isOpen} />,
    ];
};
