import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import type { FitAnchorWidth, Placement } from '../Popover/constants';
import { classNames } from '../../utils';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxPopover';

/**
 * Component default class name.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-popover';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Defines the props for the core ComboboxPopover template.
 */
export interface ComboboxPopoverProps extends HasClassName {
    /** Content (should contain a ComboboxList). */
    children?: JSXElement;
    /** Whether a click anywhere out of the popover would close it. */
    closeOnClickAway?: boolean;
    /** Whether an escape key press would close the popover. */
    closeOnEscape?: boolean;
    /** Manage popover width relative to anchor. Defaults to `true` (minWidth). */
    fitToAnchorWidth?: FitAnchorWidth | boolean;
    /** Whether the combobox is open. */
    isOpen?: boolean;
    /** Placement relative to anchor. Defaults to `'bottom-start'`. */
    placement?: Placement;
    /** Reference to the anchor element for popover positioning. */
    anchorRef?: CommonRef;
    /** Callback invoked when the popover requests to close (click away, escape). */
    handleClose?(): void;
}

/**
 * Injected framework-specific components for ComboboxPopover rendering.
 */
export interface ComboboxPopoverComponents {
    /** Popover component (framework-specific). */
    Popover: any;
    /** FlexBox component (framework-specific). */
    FlexBox: any;
}

/**
 * ComboboxPopover core template.
 * Renders a Popover with combobox-specific defaults (className, closeMode, closeOnClickAway, closeOnEscape).
 *
 * Framework-specific components (Popover) are passed as a second argument
 * by the React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const ComboboxPopover = (props: ComboboxPopoverProps, { Popover, FlexBox }: ComboboxPopoverComponents) => {
    const {
        children,
        className,
        closeOnClickAway = true,
        closeOnEscape = false,
        fitToAnchorWidth = true,
        isOpen,
        placement = 'bottom-start' as Placement,
        anchorRef,
        handleClose,
        ...forwardedProps
    } = props;

    return (
        <Popover
            {...forwardedProps}
            placement={placement}
            fitToAnchorWidth={fitToAnchorWidth}
            className={block([className])}
            anchorRef={anchorRef}
            isOpen={isOpen}
            onClose={handleClose}
            closeOnClickAway={closeOnClickAway}
            closeOnEscape={closeOnEscape}
            closeMode="hide"
        >
            <FlexBox orientation="vertical" className={element('scroll')}>
                {children}
            </FlexBox>
        </Popover>
    );
};
