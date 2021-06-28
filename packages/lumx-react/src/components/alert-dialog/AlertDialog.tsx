import React, { forwardRef } from 'react';

import classNames from 'classnames';

import {
    DialogProps,
    Dialog,
    Button,
    Emphasis,
    ColorPalette,
    Icon,
    Size,
    Kind,
    Toolbar,
    ButtonProps,
} from '@lumx/react';

import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons/';
import { uid } from 'uid';
import { Comp, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

export interface AlertDialogProps extends Omit<DialogProps, 'header' | 'footer'> {
    /** Message variant. */
    kind?: Kind;
    /** Dialog title. */
    title?: string;
    /** Props forwarded to the confirm button */
    confirmProps: ButtonProps & {
        onClick(): void;
        label: string;
    };
    /**
     * Props forwarded to the cancel button.
     * Will not render a cancel button if undefined.
     */
    cancelProps?: ButtonProps & {
        onClick(): void;
        label: string;
    };
}

/**
 * Associative map from message kind to color and icon.
 */
const CONFIG = {
    [Kind.error]: { color: ColorPalette.red, icon: mdiAlert },
    [Kind.info]: { color: ColorPalette.blue, icon: mdiInformation },
    [Kind.success]: { color: ColorPalette.green, icon: mdiCheckCircle },
    [Kind.warning]: { color: ColorPalette.yellow, icon: mdiAlertCircle },
};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'AlertDialog';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<DialogProps> = {
    size: Size.tiny,
    kind: Kind.info,
};

/**
 * AlertDialog component.
 *
 * An alert dialog is a modal dialog that interrupts the user's workflow to
 * communicate an important message and acquire a response.
 *
 * It should not have a complex content.
 * Children of this component should only be strings, paragraphs or links.
 */
export const AlertDialog: Comp<AlertDialogProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        id,
        title,
        className,
        cancelProps,
        confirmProps,
        kind,
        size,
        dialogProps,
        children,
        ...forwardedProps
    } = props;

    const cancelButtonRef = React.useRef(null);
    const confirmationButtonRef = React.useRef(null);
    const { color, icon } = CONFIG[kind as Kind] || {};

    // Define a unique ID to target title and description for aria attributes.
    const uniqueId = React.useMemo(() => id || uid(), [id]);
    const titleId = `${uniqueId}-title`;
    const descriptionId = `${uniqueId}-description`;

    // If content is a string, set in a paragraph.
    const DescriptionElement = typeof children === 'string' ? 'p' : 'div';

    const { label: confirmLabel, onClick: confirmOnClick, ...forwardedConfirmProps } = confirmProps;
    const { label: cancelLabel, onClick: cancelOnClick, ...forwardedCancelProps } = cancelProps || {};

    return (
        <Dialog
            ref={ref}
            focusElement={cancelProps ? cancelButtonRef : confirmationButtonRef}
            size={size}
            dialogProps={{
                id: uniqueId,
                role: 'alertdialog',
                'aria-labelledby': titleId,
                'aria-describedby': descriptionId,
                ...dialogProps,
            }}
            className={classNames(
                className,
                handleBasicClasses({
                    kind,
                    prefix: CLASSNAME,
                }),
            )}
            {...forwardedProps}
        >
            <header>
                <Toolbar
                    className="lumx-spacing-margin-horizontal"
                    before={<Icon icon={icon} size={Size.s} color={color} />}
                    label={
                        <h2 id={titleId} className="lumx-typography-title">
                            {title}
                        </h2>
                    }
                />
            </header>

            {children && (
                <DescriptionElement
                    id={descriptionId}
                    className="lumx-typography-body2 lumx-spacing-padding-vertical-big lumx-spacing-padding-horizontal-huge"
                >
                    {children}
                </DescriptionElement>
            )}

            <footer>
                <Toolbar
                    className="lumx-spacing-margin-horizontal"
                    after={
                        <>
                            {cancelProps && (
                                <Button
                                    {...forwardedCancelProps}
                                    ref={cancelButtonRef}
                                    emphasis={Emphasis.medium}
                                    onClick={cancelOnClick}
                                >
                                    {cancelLabel}
                                </Button>
                            )}
                            <Button
                                {...forwardedConfirmProps}
                                ref={confirmationButtonRef}
                                color={color}
                                className="lumx-spacing-margin-left-regular"
                                onClick={confirmOnClick}
                            >
                                {confirmLabel}
                            </Button>
                        </>
                    }
                />
            </footer>
        </Dialog>
    );
});

AlertDialog.displayName = COMPONENT_NAME;
AlertDialog.className = CLASSNAME;
AlertDialog.defaultProps = DEFAULT_PROPS;
