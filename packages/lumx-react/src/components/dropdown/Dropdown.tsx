import React, { cloneElement, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { List, ListProps } from '@lumx/react/components/list/List';
import { Offset, Placement, Popover } from '@lumx/react/components/popover/Popover';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { useInfiniteScroll } from '@lumx/react/hooks/useInfiniteScroll';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface DropdownProps extends GenericProps {
    /** The reference of the DOM element used to set the position of the popover.
     * @see {@link PopoverProps#anchorRef}
     */
    anchorRef: React.RefObject<HTMLElement>;
    /** The children elements. */
    children: React.ReactNode;
    /**
     * Whether a click anywhere out of the Dropdown would close it or not.
     * @see {@link PopoverProps#closeOnClickAway}
     */
    closeOnClickAway?: boolean;
    /**
     * Whether to close the Dropdown when clicking in it or not.
     */
    closeOnClick?: boolean;
    /**
     * Whether an escape key press would close the Dropdown or not.
     * @see {@link PopoverProps#closeOnEscape}
     */
    closeOnEscape?: boolean;
    /**
     * Whether the dropdown should fit to the anchor width (if dropdown is smaller) or not.
     * @see {@link PopoverProps#fitToAnchorWidth}
     */
    fitToAnchorWidth?: boolean;
    /**
     * Whether the dropdown should shrink to fit within the viewport height or not.
     * @see {@link PopoverProps#fitWithinViewportHeight}
     */
    fitWithinViewportHeight?: boolean;
    /**
     * Whether the dropdown should be displayed or not. Useful to control the Dropdown from outside the component.
     * @see {@link PopoverProps#isOpen}
     */
    isOpen: boolean;
    /**
     * The offset that will be applied to the Dropdown position.
     * @see {@link PopoverProps#offset}
     */
    offset?: Offset;
    /**
     * The preferred Dropdown location against the anchor element.
     * @see {@link PopoverProps#placement}
     */
    placement?: ValueOf<Placement>;
    /** Whether the focus should be set on the list when the dropdown is open or not. */
    shouldFocusOnOpen?: boolean;
    /**
     * The z-axis position.
     * @see {@link PopoverProps#zIndex}
     */
    zIndex?: number;
    /**
     * The function called on close.
     * @see {@link PopoverProps#onClose}
     */
    onClose?(): void;
    /** The callback function called when the bottom of the dropdown is reached. */
    onInfiniteScroll?(): void;
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
        isOpen,
        offset,
        onClose,
        onInfiniteScroll,
        placement,
        shouldFocusOnOpen,
        zIndex,
        ...forwardedProps
    } = props;
    const popoverRef = useRef<HTMLDivElement>(null);
    const listElement = useRef(null);

    useInfiniteScroll(popoverRef, onInfiniteScroll);

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
    }, [listElement, popoverRef, children, className, closeOnClick, props]);

    return isOpen ? (
        <Popover
            {...forwardedProps}
            anchorRef={anchorRef}
            className={classNames(className, `${CLASSNAME}__menu`, handleBasicClasses({ prefix: CLASSNAME }))}
            closeOnClickAway={closeOnClickAway}
            closeOnEscape={closeOnEscape}
            fitToAnchorWidth={fitToAnchorWidth}
            fitWithinViewportHeight={fitWithinViewportHeight}
            focusElement={shouldFocusOnOpen ? listElement : undefined}
            isOpen={isOpen}
            offset={offset}
            onClose={onClose}
            placement={placement}
            popoverRef={popoverRef}
            zIndex={zIndex}
        >
            {popperElement}
        </Popover>
    ) : null;
};
Dropdown.displayName = COMPONENT_NAME;
Dropdown.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Dropdown, DropdownProps };
