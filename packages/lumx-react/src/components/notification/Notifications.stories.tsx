import React, { useState } from 'react';

import { Button, Notification, NotificationType } from '@lumx/react';

import noop from 'lodash/noop';

export default { title: 'Notification' };

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

export const Error = () => <Notification {...properties.error} />;

export const Info = () => <Notification {...properties.info} />;

export const InfoWithCallback = () => <Notification {...properties.infoWithCallback} />;

export const Success = () => <Notification {...properties.success} />;

export const Warning = () => <Notification {...properties.warning} />;

export const OnTrigger = () => {
    const [isOpen, setIsOpen] = useState(false);
    const onClick = () => setIsOpen(!isOpen);

    return (
        <>
            <Button onClick={onClick}>{!isOpen ? 'Show Notification' : 'Close Notification'}</Button>
            <Notification {...properties.error} isOpen={isOpen} />
        </>
    );
};
