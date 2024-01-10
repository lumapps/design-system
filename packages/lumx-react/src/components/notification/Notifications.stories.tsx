import { Notification, Kind } from '@lumx/react';
import { NOTIFICATION_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import React from 'react';
import { createPortal } from 'react-dom';
import { NotificationStack } from '@lumx/react/components/notification/NotificationStack';
import { withChromaticForceScreenSize } from '../../stories/decorators/withChromaticForceScreenSize';

export default {
    title: 'LumX components/notification/Notification',
    component: Notification,
    args: Notification.defaultProps,
    argTypes: {
        type: getSelectArgType(Kind),
        onClick: { action: true },
    },
    parameters: {
        // Delay Chromatic snapshot to wait for notification to open.
        chromatic: {
            pauseAnimationAtEnd: true,
            delay: NOTIFICATION_TRANSITION_DURATION,
        },
    },
    // Force minimum chromatic screen size to make sure the dialog appears in view.
    decorators: [withChromaticForceScreenSize()],
};

/**
 * Error notification
 */
export const Error = {
    args: {
        type: Kind.error,
        content: 'Error',
        isOpen: true,
    },
};

/**
 * Info notification
 */
export const Info = {
    args: {
        type: Kind.info,
        content: 'Info',
        isOpen: true,
    },
};

/**
 * Success notification
 */
export const Success = {
    args: {
        type: Kind.success,
        content: 'Success',
        isOpen: true,
    },
};

/**
 * Warning notification
 */
export const Warning = {
    args: {
        type: Kind.warning,
        content: 'Warning',
        isOpen: true,
    },
};

/**
 * Info notification with action button
 */
export const InfoWithAction = {
    argTypes: {
        onActionClick: { action: true },
    },
    args: {
        type: Kind.info,
        content: 'InfoWithAction',
        actionLabel: 'Undo',
        isOpen: true,
    },
};

const useOpenTemporarily = (delay: number, duration: number) => {
    const [isOpen, setOpen] = React.useState(delay === 0);
    React.useEffect(() => {
        setTimeout(() => {
            setOpen(true);
            setTimeout(() => setOpen(false), duration);
        }, delay);
    }, [delay, duration]);
    return isOpen;
};

export const WithStack = () => (
    <NotificationStack>
        <Notification type="info" content="Info qsd 1" isOpen={useOpenTemporarily(0, 4000)} />
        <Notification type="info" content="Info qs 2" isOpen={useOpenTemporarily(1500, 3000000)} />
        <Notification type="info" content="Info slkdfjlj 1.1" isOpen={useOpenTemporarily(500, 3000)} />
        <Notification type="info" content="Info dffsddsfff 3" isOpen={useOpenTemporarily(1800, 2000_000)} />
    </NotificationStack>
);
