import React, { useState } from 'react';

import { Button, Notification, Kind } from '@lumx/react';

import noop from 'lodash/noop';

export default {
    title: 'LumX components/notification/Notification',
    parameters: {
        // Notifies Chromatic to pause the animations when they finish for the specific story.
        chromatic: { pauseAnimationAtEnd: true },
    },
};

const properties = {
    error: {
        content: 'Error',
        onClick: noop,
        isOpen: true,
        type: Kind.error,
    },
    info: {
        content: 'Info',
        onClick: noop,
        isOpen: true,
        type: Kind.info,
    },
    infoWithCallback: {
        onActionClick: noop,
        actionLabel: 'Undo',
        content: 'Info with callback',
        onClick: noop,
        isOpen: true,
        type: Kind.info,
    },
    success: {
        content: 'Success',
        onClick: noop,
        isOpen: true,
        type: Kind.success,
    },

    warning: {
        content: 'Warning',
        onClick: noop,
        isOpen: true,
        type: Kind.warning,
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
            <Button onClick={onClick}>{!isOpen ? 'Show Notification' : 'Close Notification'}</Button>,
            <Notification {...properties.error} isOpen={isOpen} />,
        </>
    );
};
