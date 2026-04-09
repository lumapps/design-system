import React from 'react';

import { DialogProps, Dialog, Button, Icon, Toolbar, ButtonProps } from '@lumx/react';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    AlertDialog as UI,
    BaseAlertDialogProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/AlertDialog';

export interface AlertDialogProps extends Omit<DialogProps, 'header' | 'footer'>, UIProps {
    /** Props forwarded to the confirm button */
    confirmProps: ButtonProps & {
        label: string;
    };
    /**
     * Props forwarded to the cancel button.
     * Will not render a cancel button if undefined.
     */
    cancelProps?: ButtonProps & {
        label: string;
    };
}

/**
 * AlertDialog component.
 *
 * An alert dialog is a modal dialog that interrupts the user's workflow to
 * communicate an important message and acquire a response.
 *
 * It should not have a complex content.
 * Children of this component should only be strings, paragraphs or links.
 */
export const AlertDialog = forwardRef<AlertDialogProps, HTMLDivElement>((props, ref) => {
    const { id, title, className, cancelProps, confirmProps, kind, size, dialogProps, children, ...forwardedProps } =
        props;

    const cancelButtonRef = React.useRef(null);
    const confirmationButtonRef = React.useRef(null);

    // Define a unique ID to target title and description for aria attributes.
    const generatedId = useId();
    const uniqueId = id || generatedId;

    // If content is a string, set in a paragraph.
    const DescriptionElement = typeof children === 'string' ? 'p' : 'div';

    return UI({
        Button,
        confirmProps,
        DescriptionElement,
        Dialog,
        Icon,
        id: uniqueId,
        Toolbar,
        cancelButtonRef,
        cancelProps,
        children,
        className,
        confirmationButtonRef,
        dialogProps,
        kind,
        ref,
        size,
        title,
        ...forwardedProps,
    });
});

AlertDialog.displayName = COMPONENT_NAME;
AlertDialog.className = CLASSNAME;
AlertDialog.defaultProps = DEFAULT_PROPS;
