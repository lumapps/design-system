/* eslint-disable react-hooks/rules-of-hooks */
import { RefObject, useRef } from 'react';
import { Button, Link, Kind } from '@lumx/react';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withChromaticForceScreenSize } from '../../stories/decorators/withChromaticForceScreenSize';
import { AlertDialog } from './AlertDialog';
import DialogStories from '../dialog/Dialog.stories';

export default {
    title: 'LumX components/alert-dialog/AlertDialog',
    component: AlertDialog,
    args: {
        ...AlertDialog.defaultProps,
        'confirmProps.label': 'Ok',
    },
    argTypes: {
        size: DialogStories.argTypes.size,
        kind: getSelectArgType(Kind),
        'confirmProps.onClick': { action: true },
    },
    parameters: {
        // Delay Chromatic snapshot to wait for dialog to open.
        chromatic: {
            pauseAnimationAtEnd: true,
            delay: DIALOG_TRANSITION_DURATION,
        },
    },
    decorators: [
        // Force minimum chromatic screen size to make sure the dialog appears in view.
        withChromaticForceScreenSize(),
        withNestedProps(),
    ],
    render(props: any) {
        const buttonRef = useRef() as RefObject<HTMLButtonElement>;
        const [isOpen, close, open] = useBooleanState(true);
        return (
            <>
                <Button ref={buttonRef} onClick={open}>
                    Open dialog
                </Button>
                <AlertDialog {...props} isOpen={isOpen} onClose={close} parentElement={buttonRef} />
            </>
        );
    },
};

/**
 * Alert dialog with default kind
 */
export const DefaultKind = {
    args: {
        title: 'Default (info)',
        children: loremIpsum('tiny'),
    },
};

/**
 * Alert dialog as warning
 */
export const Warning = {
    args: {
        ...DefaultKind.args,
        kind: Kind.warning,
        title: 'Warning',
    },
};

/**
 * Alert dialog as success
 */
export const Success = {
    args: {
        ...DefaultKind.args,
        kind: Kind.success,
        title: 'Success',
    },
};

/**
 * Alert dialog as error
 */
export const Error = {
    args: {
        ...DefaultKind.args,
        kind: Kind.error,
        title: 'Error',
    },
};

/**
 * Alert dialog with cancel button
 */
export const WithCancel = {
    argTypes: {
        'cancelProps.onClick': { action: true },
    },
    args: {
        ...DefaultKind.args,
        title: 'With Cancel',
        'cancelProps.label': 'Cancel',
    },
};

/**
 * Alert dialog with rich description
 */
export const RichDescription = {
    argTypes: { children: { control: false } },
    args: {
        ...DefaultKind.args,
        title: 'With Rich Description',
        children: (
            <>
                Amet ut elit dolore irure mollit <strong>sunt culpa esse</strong>.<br />
                Ea ut Lorem.
                <br />
                <Link href="https://example.com" target="_blank">
                    Link
                </Link>
            </>
        ),
    },
};
