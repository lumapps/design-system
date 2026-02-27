import { ReactNode } from 'react';

import { HasAriaLabelOrLabelledBy } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS } from '@lumx/core/js/components/PopoverDialog';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { HeadingLevelProvider } from '@lumx/react/components/heading';
import { Popover, type PopoverProps } from '../popover/Popover';

/**
 * PopoverDialog props.
 * The PopoverDialog has the same props as the Popover but requires an accessible label.
 */
export type PopoverDialogProps = PopoverProps &
    HasAriaLabelOrLabelledBy & {
        /** Accessible label for the dialog (alternative to aria-label prop). */
        label?: string;
    };

/**
 * PopoverDialog component.
 * Defines a popover that acts like a dialog:
 * - Has a dialog aria role
 * - Sets a focus trap within the popover
 * - Closes on click away and escape
 * - Resets heading level context to 2
 */
export const PopoverDialog = forwardRef<PopoverDialogProps, HTMLDivElement>((props, ref) => {
    const { children, 'aria-label': ariaLabel, label = ariaLabel, className, ...forwardedProps } = props;

    return (
        <Popover
            {...forwardedProps}
            ref={ref}
            className={classNames.join(className, CLASSNAME)}
            role="dialog"
            aria-modal="true"
            /**
             * If a label is set, set as aria-label.
             * If it is undefined, the label can be set using the `aria-label` and `aria-labelledby` props
             */
            aria-label={label}
            closeOnClickAway
            closeOnEscape
            withFocusTrap
        >
            <HeadingLevelProvider level={2}>{children as ReactNode}</HeadingLevelProvider>
        </Popover>
    );
});

PopoverDialog.displayName = COMPONENT_NAME;
PopoverDialog.className = CLASSNAME;
PopoverDialog.defaultProps = DEFAULT_PROPS as Partial<PopoverDialogProps>;
