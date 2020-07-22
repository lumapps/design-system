import React, { cloneElement, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';

import { List, ListProps } from '@lumx/react/components/list/List';
import { Offset, Placement, Popover } from '@lumx/react/components/popover/Popover';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { useInfiniteScroll } from '@lumx/react/hooks/useInfiniteScroll';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface DropdownProps extends GenericProps {
    /** The reference of the DOM element used to set the position of the Dropdown. */
    anchorRef: React.RefObject<HTMLElement>;
    /** Children of the Dropdown. */
    children: React.ReactNode;
    /** Whether a click anywhere out of the Dropdown would close it. */
    closeOnClickAway?: boolean;
    /** Whether an escape key press would close the Dropdown. */
    closeOnEscape?: boolean;
    /** Whether to close the Dropdown when clicking in it. */
    closeOnClick?: boolean;
    /** Whether the dropdown should fit to the anchor width (if dropdown is smaller). */
    fitToAnchorWidth?: boolean;
    /** Vertical and/or horizontal offsets that will be applied to the Dropdown position. */
    offset?: Offset;
    /** The preferred Dropdown location against the anchor element. */
    placement?: Placement.BOTTOM | Placement.BOTTOM_END | Placement.BOTTOM_START;
    /** Whether the focus should be set on the list when the dropdown is open. */
    shouldFocusOnOpen?: boolean;
    /** Whether the dropdown should be displayed or not. Useful to control the Dropdown from outside the component. */
    isOpen: boolean;
    /** The z-axis position. */
    zIndex?: number;
    /** The function to be called when the user clicks away or Escape is pressed */
    onClose?: VoidFunction;
    /**
     * The callback function called when the bottom of the dropdown is reached.
     */
    onInfiniteScroll?: VoidFunction;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Dropdown`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<DropdownProps> = {
    closeOnClick: true,
    closeOnClickAway: true,
    closeOnEscape: true,
    fitToAnchorWidth: true,
    placement: Placement.BOTTOM_START,
    shouldFocusOnOpen: true,
    isOpen: undefined,
};

/**
 * Displays a dropdown.
 *
 * @param  props The component props.
 * @return The component.
 */
const Dropdown: React.FC<DropdownProps> = (props) => {
    const {
        anchorRef,
        children,
        className,
        closeOnClick = DEFAULT_PROPS.closeOnClick,
        closeOnClickAway = DEFAULT_PROPS.closeOnClickAway,
        closeOnEscape = DEFAULT_PROPS.closeOnEscape,
        fitToAnchorWidth = DEFAULT_PROPS.fitToAnchorWidth,
        offset,
        placement = DEFAULT_PROPS.placement,
        shouldFocusOnOpen = DEFAULT_PROPS.shouldFocusOnOpen,
        isOpen,
        zIndex,
        onClose,
        onInfiniteScroll,
        ...forwardedProps
    } = props;
    const popoverRef = useRef<HTMLDivElement>(null);
    const [listElement, setListElement] = useState<HTMLUListElement>();

    if (onInfiniteScroll) {
        useInfiniteScroll(popoverRef, onInfiniteScroll);
    }

    const popperElement = useMemo(() => {
        return !Array.isArray(children) && isComponent(List)(children)
            ? cloneElement<ListProps>(children, {
                  ...children.props,
                  listElementRef: setListElement,
                  onClick(evt: MouseEvent) {
                      children.props.onClick?.(evt);

                      if (closeOnClick) {
                          onClose?.();
                      }
                  },
                  isClickable: true,
              })
            : children;
    }, [setListElement, popoverRef, children, className, closeOnClick, props]);

    // Set the focus on the list when the dropdown opens,
    // in order to enable keyboard controls.
    useFocus(listElement, isOpen && shouldFocusOnOpen);

    return isOpen ? (
        <Popover
            {...forwardedProps}
            className={classNames(className, `${CLASSNAME}__menu`, handleBasicClasses({ prefix: CLASSNAME }))}
            anchorRef={anchorRef}
            popoverRef={popoverRef}
            placement={placement}
            offset={offset}
            zIndex={zIndex}
            fitToAnchorWidth={fitToAnchorWidth}
            fitWithinViewportHeight
            isOpen={isOpen}
            onClose={onClose}
            closeOnClickAway={closeOnClickAway}
            closeOnEscape={closeOnEscape}
        >
            {popperElement}
        </Popover>
    ) : null;
};
Dropdown.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Dropdown, DropdownProps };
