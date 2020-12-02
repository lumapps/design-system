import React, { cloneElement, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { List, ListProps } from '@lumx/react/components/list/List';
import { Offset, Placement, Popover, PopoverProps } from '@lumx/react/components/popover/Popover';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
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
    /** Whether the dropdown should shrink to fit within the viewport height. */
    fitWithinViewportHeight?: PopoverProps['fitWithinViewportHeight'];
    /** Vertical and/or horizontal offsets that will be applied to the Dropdown position. */
    offset?: Offset;
    /** The preferred Dropdown location against the anchor element. */
    placement?: Placement;
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
    fitWithinViewportHeight: true,
    placement: Placement.BOTTOM_START,
    shouldFocusOnOpen: true,
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
        closeOnClick,
        closeOnClickAway,
        closeOnEscape,
        fitToAnchorWidth,
        fitWithinViewportHeight,
        offset,
        placement,
        shouldFocusOnOpen,
        isOpen,
        zIndex,
        onClose,
        onInfiniteScroll,
        ...forwardedProps
    } = props;
    const innerRef = useRef<HTMLDivElement>(null);
    const listElement = useRef(null);

    useInfiniteScroll(innerRef, onInfiniteScroll);

    const popperElement = useMemo(() => {
        return !Array.isArray(children) && isComponent(List)(children)
            ? cloneElement<ListProps>(children, {
                  ...children.props,
                  listElementRef: listElement,
                  onClick(evt: MouseEvent) {
                      children.props.onClick?.(evt);

                      if (closeOnClick) {
                          onClose?.();
                      }
                  },
                  isClickable: true,
              })
            : children;
    }, [listElement, innerRef, children, className, closeOnClick, props]);

    return isOpen ? (
        <Popover
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
            anchorRef={anchorRef}
            placement={placement}
            offset={offset}
            zIndex={zIndex}
            fitToAnchorWidth={fitToAnchorWidth}
            fitWithinViewportHeight={fitWithinViewportHeight}
            isOpen={isOpen}
            onClose={onClose}
            closeOnClickAway={closeOnClickAway}
            closeOnEscape={closeOnEscape}
            focusElement={shouldFocusOnOpen ? listElement : undefined}
        >
            <div className={`${CLASSNAME}__menu`} ref={innerRef}>
                {popperElement}
            </div>
        </Popover>
    ) : null;
};
Dropdown.displayName = COMPONENT_NAME;
Dropdown.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Dropdown, DropdownProps };
