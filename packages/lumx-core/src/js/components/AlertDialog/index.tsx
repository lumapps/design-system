import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';
import { ColorPalette, Emphasis, Kind, Size } from '../../constants';
import type { LumxClassName, JSXElement, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { DialogProps } from '../Dialog';

export interface BaseAlertDialogProps {
    /** Message variant. */
    kind?: Kind;
    /** Dialog title. */
    title?: string;
    /**
     * Children
     */
    children?: JSXElement;
}

export interface AlertDialogProps extends HasClassName, BaseAlertDialogProps, Pick<DialogProps, 'size'> {
    /** Props forwarded to the confirm button */
    confirmProps: any;
    /**
     * Props forwarded to the cancel button.
     * Will not render a cancel button if undefined.
     */
    cancelProps?: any;
    /** Props forwarded to the dialog wrapper element. */
    dialogProps?: any;
    /** Ref forwarded to the dialog root element. */
    ref?: CommonRef;
    /** Ref forwarded to the cancel button element. */
    cancelButtonRef?: CommonRef;
    /** Ref forwarded to the confirm button element. */
    confirmationButtonRef?: CommonRef;
    /** Element used to wrap the description (children). */
    DescriptionElement: any;
    /** Dialog component injected by the framework wrapper. */
    Dialog: any;
    /** Toolbar component injected by the framework wrapper. */
    Toolbar: any;
    /** Button component injected by the framework wrapper. */
    Button: any;
    /** Icon component injected by the framework wrapper. */
    Icon: any;
    /** Unique identifier for the dialog (used for aria-labelledby / aria-describedby). */
    id: string;
    /**
     * Pre-computed focus element.
     * Allows framework wrappers to pass the actual DOM element directly when ref-on-component
     * does not yield a DOM node (e.g. Vue). Falls back to cancelButtonRef / confirmationButtonRef.
     */
    focusElement?: any;
}

/**
 * Associative map from message kind to color and icon.
 */
export const CONFIG = {
    [Kind.error]: { color: ColorPalette.red, icon: mdiAlert },
    [Kind.info]: { color: ColorPalette.blue, icon: mdiInformation },
    [Kind.success]: { color: ColorPalette.green, icon: mdiCheckCircle },
    [Kind.warning]: { color: ColorPalette.yellow, icon: mdiAlertCircle },
};

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'AlertDialog';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-alert-dialog';
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<AlertDialogProps> = {
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
export const AlertDialog = (props: AlertDialogProps) => {
    const {
        id,
        title,
        className,
        cancelProps,
        confirmProps,
        ref,
        kind = DEFAULT_PROPS.kind,
        size = DEFAULT_PROPS.size,
        dialogProps,
        children,
        DescriptionElement,
        cancelButtonRef,
        confirmationButtonRef,
        focusElement,
        Dialog,
        Toolbar,
        Button,
        Icon,
        ...forwardedProps
    } = props;
    const { color, icon } = CONFIG[kind as Kind] || {};

    const titleId = `${id}-title`;
    const descriptionId = `${id}-description`;

    const { label: confirmLabel, onClick: confirmOnClick, ...forwardedConfirmProps } = confirmProps;
    const { label: cancelLabel, onClick: cancelOnClick, ...forwardedCancelProps } = cancelProps || {};

    return (
        <Dialog
            ref={ref}
            focusElement={focusElement ?? (cancelProps ? cancelButtonRef : confirmationButtonRef)}
            size={size}
            dialogProps={{
                id,
                role: 'alertdialog',
                'aria-labelledby': titleId,
                'aria-describedby': descriptionId,
                ...dialogProps,
            }}
            className={classNames.join(
                className,
                block({
                    [`kind-${kind}`]: Boolean(kind),
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
};
