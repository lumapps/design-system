import { Notification, Kind } from '@lumx/react';
import { NOTIFICATION_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
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

/**
 * Info notification rendered outside a React portal
 */
export const InfoWithoutPortal = {
    args: {
        ...Info.args,
        usePortal: false,
    },
};
