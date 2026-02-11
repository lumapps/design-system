import React from 'react';

import { UseComboboxTriggerArgs, useComboboxTrigger } from './useComboboxTrigger';

/**
 * Provide props for the semantic and behaviors the combobox input trigger
 *
 * Overrides the useComboboxTrigger() props & behavior to prevent open on click
 * if `openOnFocus` is not enabled.
 */
export function useComboboxInput({ onKeyDown: propsOnKeyDown, ...args }: UseComboboxTriggerArgs) {
    const triggerProps = useComboboxTrigger(args);
    const { onClick, onKeyDown, 'aria-expanded': showPopover } = triggerProps;

    const handleClick = () => {
        if (!args.context.openOnFocus && !args.context.openOnClick) {
            // Skip if input should not opening on focus nor click
            return;
        }
        onClick();
    };

    const handleKeyDown: React.KeyboardEventHandler = (evt) => {
        if (evt.key === 'Escape') {
            // Reset field if closed
            if (!showPopover) {
                args.context.handleInputChange('');
            }
            return;
        }

        onKeyDown(evt);

        if (propsOnKeyDown) {
            propsOnKeyDown(evt);
        }
    };

    return { ...triggerProps, onClick: handleClick, onKeyDown: handleKeyDown };
}
