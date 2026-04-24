import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Label display mode for the ComboboxButton.
 * - `'show-selection'`: Show the selected value if available, otherwise the label.
 * - `'show-label'`: Always show the label.
 * - `'show-tooltip'`: Show nothing in the button; label appears only in tooltip.
 */
export type ComboboxButtonLabelDisplayMode = 'show-selection' | 'show-label' | 'show-tooltip';

/**
 * Custom render function replacing the default `<Button>`. Receives the merged button props
 * (ARIA attrs, ref, className and any forwarded caller props) and the resolved children string
 * (computed from `labelDisplayMode`; `null` when `labelDisplayMode='show-tooltip'`).
 *
 * The `<Tooltip>` wrapper is **always** rendered around the result, keeping accessibility
 * semantics consistent regardless of which element the render function returns.
 *
 * The `buttonProps` object **must** be spread onto the slot's root element so that the
 * combobox ARIA attributes (`role`, `aria-controls`, `aria-haspopup`, `aria-expanded`,
 * `aria-activedescendant`) and the `ref` callback reach the underlying DOM node.
 */
export type ComboboxRenderButton<E = JSXElement> = (buttonProps: Record<string, any>, children: string | null) => E;

/**
 * Defines the props for the core ComboboxButton template.
 */
export interface ComboboxButtonProps extends HasClassName {
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
    /** Custom render button */
    renderButton?: ComboboxRenderButton;
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
        renderButton,
        ...forwardedProps
    } = props;

    // Determine what children to display
    const showSelection = labelDisplayMode === 'show-selection';
    const tooltipOnly = labelDisplayMode === 'show-tooltip';

    const selectionLabel = showSelection && value ? value : null;
    const children: string | null = tooltipOnly ? null : selectionLabel || label;

    // Hide tooltip if the displayed children equal the label or when open
    const hideTooltip = label === children || isOpen;

    // Build the merged props object that must be spread on the rendered button root.
    // These props include the required combobox ARIA attributes, the ref callback, and
    // any additional caller-provided forwarded props.
    const buttonProps: Record<string, any> = {
        ref,
        ...forwardedProps,
        tabIndex: 0,
        className: classNames.join(className, CLASSNAME),
        role: 'combobox',
        'aria-controls': listboxId,
        'aria-haspopup': 'listbox',
        'aria-expanded': isOpen,
        'aria-activedescendant': '',
    };

    return (
        <Tooltip
            className={hideTooltip ? classNames.visuallyHidden() : undefined}
            label={label}
            closeMode="hide"
            ariaLinkMode="aria-labelledby"
        >
            {renderButton ? renderButton(buttonProps, children) : <Button {...buttonProps}>{children}</Button>}
        </Tooltip>
    );
};
