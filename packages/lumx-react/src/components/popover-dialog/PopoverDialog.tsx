import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { Comp, HasAriaLabelOrLabelledBy } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
export const PopoverDialog: Comp<PopoverDialogProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        children,
        isOpen,
        focusElement,
        'aria-label': ariaLabel,
        label = ariaLabel,
        className,
        ...forwardedProps
    } = props;

    return (
        <Popover
            {...forwardedProps}
            ref={ref}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
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
            {children}
        </Popover>
    );
});

PopoverDialog.displayName = COMPONENT_NAME;
PopoverDialog.className = CLASSNAME;
PopoverDialog.defaultProps = DEFAULT_PROPS;
