import { HasAriaLabelOrLabelledBy } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

import { HeadingLevelProvider } from '@lumx/react/components/heading';
import { Popover, PopoverProps } from '../popover/Popover';

/**
 * PopoverDialog props.
 * The PopoverDialog has the same props as the Popover but requires an accessible label.
 */
export type PopoverDialogProps = PopoverProps & HasAriaLabelOrLabelledBy;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'PopoverDialog';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-popover-dialog';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<PopoverDialogProps> = {};

/**
 * PopoverDialog component.
 * Defines a popover that acts like a dialog
 * * Has a dialog aria role
 * * Sets a focus trap within the popover
 * * Closes on click away and escape.
 */
export const PopoverDialog = forwardRef<PopoverDialogProps, HTMLDivElement>((props, ref) => {
    const {
        children,
        isOpen,
        focusElement,
        'aria-label': ariaLabel,
        label = ariaLabel,
        className,
        ...forwardedProps
    } = props;
    const { block } = useClassnames(CLASSNAME);

    return (
        <Popover
            {...forwardedProps}
            ref={ref}
            className={block([className])}
            role="dialog"
            aria-modal="true"
            /**
             * If a label is set, set as aria-label.
             * If it is undefined, the label can be set using the `aria-label` and `aria-labelledby` props
             */
            aria-label={label}
            isOpen={isOpen}
            focusElement={focusElement}
            closeOnClickAway
            closeOnEscape
            withFocusTrap
        >
            <HeadingLevelProvider level={2}>{children}</HeadingLevelProvider>
        </Popover>
    );
});

PopoverDialog.displayName = COMPONENT_NAME;
PopoverDialog.className = CLASSNAME;
PopoverDialog.defaultProps = DEFAULT_PROPS;
