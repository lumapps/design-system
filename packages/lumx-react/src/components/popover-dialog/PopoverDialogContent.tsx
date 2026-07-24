import { ReactNode } from 'react';

import { classNames } from '@lumx/core/js/utils';
import { resolveAccessibleNameProps } from '@lumx/core/js/utils/aria/resolveAccessibleNameProps';
import { DIALOG_LABEL_KEY } from '@lumx/core/js/components/Dialog/constants';
import { CLASSNAME, type PopoverDialogProps as CorePopoverDialogProps } from '@lumx/core/js/components/PopoverDialog';
import type { PopoverProps as CorePopoverProps } from '@lumx/core/js/components/Popover';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { HeadingLevelProvider } from '@lumx/react/components/heading';
import { useRegisteredId } from '@lumx/react/utils/IdsRegistryContext';

import { Popover, type PopoverProps } from '../popover/Popover';

/**
 * PopoverDialog props.
 * The PopoverDialog has the same props as the Popover, plus optional accessible-name props
 * (`label`/`aria-label`/`aria-labelledby`). An accessible name can also be provided by rendering
 * a `DialogHeading` inside the dialog - at least one of these should be used.
 */
export type PopoverDialogProps = PopoverProps & Omit<CorePopoverDialogProps, keyof CorePopoverProps>;

/**
 * Renders the core Popover as a dialog, resolving its `aria-labelledby` from the ids registry.
 *
 * Must render as a descendant of the `IdsRegistryProvider` set up by `PopoverDialog` (which is why it
 * is its own component: the subscription hook needs to run below the provider). Internal to the
 * popover-dialog family - not exported from the package barrel.
 */
export const PopoverDialogContent = forwardRef<PopoverDialogProps, HTMLDivElement>((props, ref) => {
    const {
        children,
        'aria-label': ariaLabelAttr,
        'aria-labelledby': ariaLabelledByAttr,
        label = ariaLabelAttr,
        className,
        ...forwardedProps
    } = props;

    const labelId = useRegisteredId(DIALOG_LABEL_KEY);

    return (
        <Popover
            {...forwardedProps}
            ref={ref}
            className={classNames.join(className, CLASSNAME)}
            role="dialog"
            aria-modal="true"
            /**
             * If a label is set, set as aria-label.
             * If it is undefined, the label can be set using the `aria-label` and `aria-labelledby` props,
             * or by rendering a `DialogHeading` inside the dialog (linked via the internal ids registry).
             */
            {...resolveAccessibleNameProps(label, ariaLabelledByAttr || labelId)}
            closeOnClickAway
            closeOnEscape
            withFocusTrap
        >
            <HeadingLevelProvider level={2}>{children as ReactNode}</HeadingLevelProvider>
        </Popover>
    );
});
