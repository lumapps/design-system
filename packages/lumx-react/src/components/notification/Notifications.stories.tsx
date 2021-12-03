import React, { useState } from 'react';

import { Button, Notification, Kind } from '@lumx/react';
import { NOTIFICATION_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { action } from '@storybook/addon-actions';
import { chromaticForceScreenSize } from '../../stories/chromaticForceScreenSize';

export default {
    title: 'LumX components/notification/Notification',
    parameters: {
        // Delay Chromatic snapshot to wait for notification to open.
        chromatic: {
            pauseAnimationAtEnd: true,
            delay: NOTIFICATION_TRANSITION_DURATION,
        },
    },
    // Force minimum chromatic screen size to make sure the dialog appears in view.
    decorators: [chromaticForceScreenSize],
};

const properties = {
    error: {
        content: 'Error',
        onClick: action('onClick'),
        isOpen: true,
        type: Kind.error,
    },
    info: {
        content: 'Info',
        onClick: action('onClick'),
        isOpen: true,
        type: Kind.info,
    },
    infoWithCallback: {
        onActionClick: action('onClick'),
        actionLabel: 'Undo',
        content: 'Info with callback',
        onClick: action('onClick'),
        isOpen: true,
        type: Kind.info,
    },
    success: {
        content: 'Success',
        onClick: action('onClick'),
        isOpen: true,
        type: Kind.success,
    },

    warning: {
        content: 'Warning',
        onClick: action('onClick'),
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
