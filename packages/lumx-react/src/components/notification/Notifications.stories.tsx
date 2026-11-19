import { IconButton, Notification, Kind } from '@lumx/react';
import { mdiClose } from '@lumx/icons';
import { action } from 'storybook/actions';
import { NOTIFICATION_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
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
 * Info notification with the action described by `actionProps`
 */
export const InfoWithActionProps = {
    args: {
        type: Kind.info,
        content: 'InfoWithActionProps',
        actionProps: { label: 'Undo', onClick: action('onClick') },
        isOpen: true,
    },
};

/**
 * Info notification with a close icon button as its action
 */
export const InfoWithCloseAction = {
    args: {
        type: Kind.info,
        content: 'InfoWithCloseAction',
        actionProps: { as: IconButton, icon: mdiClose, label: 'Close', emphasis: 'low', onClick: action('onClick') },
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
