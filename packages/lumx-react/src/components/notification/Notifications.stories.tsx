import React from 'react';

import { Button, Notification, NotificationType } from '@lumx/react';

import noop from 'lodash/noop';

export default { title: 'LumX components/Notification' };

const properties = {
    error: {
        content: 'Error',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.error,
    },
    info: {
        content: 'Info',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.info,
    },
    infoWithCallback: {
        actionCallback: noop,
        actionLabel: 'Undo',
        content: 'Info with callback',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.info,
    },
    success: {
        content: 'Success',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.success,
    },

    warning: {
        content: 'Warning',
        handleClick: noop,
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
