import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import type { ComboboxCallbacks } from './types';

/**
 * Label display mode for the ComboboxButton.
 * - `'show-selection'`: Show the selected value if available, otherwise the label.
 * - `'show-label'`: Always show the label.
 * - `'show-tooltip'`: Show nothing in the button; label appears only in tooltip.
 */
export type ComboboxButtonLabelDisplayMode = 'show-selection' | 'show-label' | 'show-tooltip';

/**
 * Defines the props for the core ComboboxButton template.
 */
export interface ComboboxButtonProps extends HasClassName, ComboboxCallbacks {
    /** The label for the button (used for ARIA and tooltip). */
    label: string;
    /** The currently selected value to display. */
    value?: string;
    /** Controls how the label/value is displayed. */
    labelDisplayMode?: ComboboxButtonLabelDisplayMode;
    /** The ID of the listbox element (for aria-controls). */
    listboxId?: string;
    /** Whether the combobox is open. */
    isOpen?: boolean;
    /** ref to the root button element. */
    ref?: CommonRef;
}

/**
 * Injected framework-specific components for ComboboxButton rendering.
 */
export interface ComboboxButtonComponents {
    /** Button component (framework-specific, e.g. React Button with theme/disabled handling). */
    Button: any;
    /** Tooltip wrapper component. */
    Tooltip: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxButton';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-button';

/**
 * ComboboxButton core template.
 * Renders a Button with combobox ARIA attributes, wrapped in a Tooltip.
 *
 * Framework-specific components (Tooltip) are passed as a second argument
 * by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const ComboboxButton = (props: ComboboxButtonProps, { Button, Tooltip }: ComboboxButtonComponents) => {
    const {
        className,
        label,
        value,
        labelDisplayMode = 'show-selection',
        listboxId,
        isOpen,
        ref,
        ...forwardedProps
    } = props;

    // Determine what content to display
    const showSelection = labelDisplayMode === 'show-selection';
    const tooltipOnly = labelDisplayMode === 'show-tooltip';

    const selectionLabel = showSelection && value ? value : null;
    const content: JSXElement = tooltipOnly ? null : selectionLabel || label;

    // Hide tooltip if the displayed content equals the label or when open
    const hideTooltip = label === content || isOpen;

    return (
        <Tooltip
            className={hideTooltip ? classNames.visuallyHidden() : undefined}
            label={label}
            closeMode="hide"
            ariaLinkMode="aria-labelledby"
        >
            <Button
                ref={ref}
                {...forwardedProps}
                className={classNames.join(className, CLASSNAME)}
                role="combobox"
                aria-controls={listboxId}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-activedescendant=""
            >
                {content}
            </Button>
        </Tooltip>
    );
};
