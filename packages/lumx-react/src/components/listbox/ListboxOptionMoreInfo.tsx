import { ReactNode, useEffect, useRef, useState } from 'react';

import {
    ListboxOptionMoreInfo as UI,
    ListboxOptionMoreInfoProps as UIProps,
    ListboxOptionMoreInfoPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxOptionMoreInfo';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { IconButton, IconButtonProps } from '@lumx/react/components/button';
import { Popover } from '@lumx/react/components/popover';
import { useListboxOptionContext } from './context/ListboxOptionContext';
import { useListboxContext } from './context/ListboxContext';
import { useListboxEvent } from './context/useListboxEvent';

/**
 * Props for Combobox.OptionMoreInfo component.
 */
export interface ListboxOptionMoreInfoProps extends ReactToJSX<UIProps, ListboxOptionMoreInfoPropsToOverride> {
    /** Content of the popover (additional details about the option). */
    children?: ReactNode;
    /** Callback when the popover opens or closes. */
    onToggle?(isOpen: boolean): void;
    /** Props forwarded to the IconButton. */
    buttonProps?: Partial<IconButtonProps>;
}

/**
 * Combobox.OptionMoreInfo component.
 *
 * Displays an info icon button on a combobox option that shows a popover with additional details.
 * The popover opens on mouse hover over the icon or when the parent option is keyboard-highlighted.
 *
 * Must be placed in the `after` slot of a `Combobox.Option`.
 *
 * Please consider using a simpler option `description` prop instead for better UX and a11y.
 *
 * @param props Component props.
 * @return React element.
 */
export const ListboxOptionMoreInfo = (props: ListboxOptionMoreInfoProps) => {
    const { children, onToggle, buttonProps, ...forwardedProps } = props;
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Get the parent option ID from the option context (provided by Combobox.Option).
    const { optionId } = useListboxOptionContext();

    // Subscribe to active descendant changes to detect keyboard highlight.
    const { list } = useListboxContext();
    const activeDescendantId = useListboxEvent(list, 'activeDescendantChange', null);
    const isKeyboardHighlighted = activeDescendantId === optionId;

    // Open on mouse hover or keyboard highlight.
    const isOpen = isHovered || isKeyboardHighlighted;

    useEffect(() => {
        onToggle?.(isOpen);
    }, [isOpen, onToggle]);

    // Predictable ID convention: the parent ListboxOption sets aria-describedby="${optionId}-more-info"
    // on the role="option" element. The Popover uses closeMode="unmount": the popover content mounts
    // synchronously when the option becomes active (same task as the aria-activedescendant update),
    // so screen readers can resolve the aria-describedby reference when they announce the option.
    const popoverId = `${optionId}-more-info`;

    return UI(
        {
            ...forwardedProps,
            ref,
            isOpen,
            popoverId,
            children,
            buttonProps,
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
        },
        { IconButton, Popover },
    );
};

ListboxOptionMoreInfo.displayName = COMPONENT_NAME;
ListboxOptionMoreInfo.className = CLASSNAME;
