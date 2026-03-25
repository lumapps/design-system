import { ReactNode } from 'react';

import { ComboboxPopover as UI, COMPONENT_NAME, CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxPopover';
import { Popover, PopoverProps } from '@lumx/react/components/popover';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxOpen } from './context/useComboboxOpen';

/**
 * Props for Popover that can be passed to Combobox.Popover.
 * Excludes isOpen, anchorRef, children, and onClose which are managed internally.
 */
export type ComboboxPopoverProps = Partial<Omit<PopoverProps, 'isOpen' | 'anchorRef' | 'children' | 'onClose'>>;

/**
 * Props for the Combobox.Popover component.
 */
export interface ComboboxPopoverComponentProps extends ComboboxPopoverProps {
    /** Content (should contain a Combobox.List). */
    children: ReactNode;
}

/**
 * Combobox.Popover component - renders a Popover connected to the combobox context.
 * Automatically binds to the combobox anchor element and open/close state.
 *
 * @param props Component props.
 * @return React element.
 */
export const ComboboxPopover = (props: ComboboxPopoverComponentProps) => {
    const { anchorRef } = useComboboxContext();
    const [isOpen, setIsOpen] = useComboboxOpen();
    const { children, ...popoverProps } = props;

    return UI(
        {
            ...popoverProps,
            children,
            isOpen,
            anchorRef: anchorRef as React.RefObject<HTMLElement>,
            handleClose: () => setIsOpen(false),
        },
        { Popover },
    );
};

ComboboxPopover.displayName = COMPONENT_NAME;
ComboboxPopover.className = CLASSNAME;
