import React from 'react';

import { visuallyHidden } from '@lumx/core/js/utils/classNames';
import { Button, Tooltip } from '@lumx/react';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { GenericProps } from '@lumx/core/js/types';

import { useComboboxRefs } from '../../context/ComboboxRefsContext';
import { useCombobox } from '../../hooks/useCombobox';
import { useComboboxButton } from '../../hooks/useComboboxButton';

export interface ComboboxButtonProps extends GenericProps {
    /**
     * Label of the combobox button trigger.
     */
    label: string;
    /**
     * Controls how the `label` is displayed:
     *  - `show-selection` (default): Displays the current selection as the label, or falls back to the provided `label`
     *     if there is no selection. The `label` will still appear as a tooltip in this mode.
     *  - `show-label`: Always displays the provided `label` as the visual label.
     *  - `show-tooltip`: Always displays the provided `label` as the visual a tooltip.
     *     (useful for IconButton combobox)
     * In all cases, the given `label` is the ARIA label in use
     */
    labelDisplayMode?: 'show-selection' | 'show-label' | 'show-tooltip';
    /**
     * Focus event handler
     */
    onFocus?: React.FocusEventHandler;
    /**
     * Blur event handler
     */
    onBlur?: React.FocusEventHandler;
    /** Customize the root element. */
    as?: React.ElementType;
}

/**
 * Combobox button trigger.
 *
 * @family Combobox
 */
export const ComboboxButton = forwardRef<ComboboxButtonProps, HTMLElement>((props, ref) => {
    const { as, label, onFocus, onBlur, labelDisplayMode = 'show-selection', ...forwardedProps } = props;
    const refs = useComboboxRefs();
    const context = useCombobox();
    const buttonProps = useComboboxButton({ context, refs, onBlur, onFocus });

    const Element = as || Button;

    const showSelection = labelDisplayMode === 'show-selection';
    const tooltipOnly = labelDisplayMode === 'show-tooltip';

    const selectionLabel = showSelection && context.selectedIds?.length && context.inputValue;

    let content: React.ReactNode = null;
    if (!tooltipOnly) {
        // Display selection label or label
        content = selectionLabel || label;
    }

    const hideTooltip =
        // Hide tooltip if the displayed label and tooltip label are the same
        label === content ||
        // Hide tooltip when the combobox is open
        context.isOpen;

    const mergedRefs = useMergeRefs(ref, refs.triggerRef as any, refs.anchorRef as any);

    return (
        <Tooltip
            className={hideTooltip ? visuallyHidden() : undefined}
            label={label}
            closeMode="hide"
            ariaLinkMode="aria-labelledby"
        >
            <Element ref={mergedRefs} {...forwardedProps} {...buttonProps}>
                {content}
            </Element>
        </Tooltip>
    );
});
