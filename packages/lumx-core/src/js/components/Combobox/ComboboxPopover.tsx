import type { HasClassName, JSXElement, LumxClassName } from '../../types';
import type { PopoverProps } from '../Popover';
import type { PopoverSizes } from '../Popover/types';
import { classNames } from '../../utils';
import { DEFAULT_COMBOBOX_POPOVER_MAX_HEIGHT } from './constants';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxPopover';

/**
 * Component default class name.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-popover';
const { block, element } = classNames.bem(CLASSNAME);

type InheritedPopoverProps = Pick<
    PopoverProps,
    'closeOnClickAway' | 'closeOnEscape' | 'fitToAnchorWidth' | 'isOpen' | 'anchorRef' | 'placement' | 'handleClose'
> &
    PopoverSizes;

/**
 * Defines the props for the core ComboboxPopover template.
 */
export interface ComboboxPopoverProps extends HasClassName, InheritedPopoverProps {
    /** Content (should contain a ComboboxList). */
    children?: JSXElement;
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
        maxHeight = DEFAULT_COMBOBOX_POPOVER_MAX_HEIGHT,
        placement = 'bottom-start',
        anchorRef,
        handleClose,
        ...forwardedProps
    } = props;

    return (
        <Popover
            {...forwardedProps}
            placement={placement}
            fitToAnchorWidth={fitToAnchorWidth}
            maxHeight={maxHeight}
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
