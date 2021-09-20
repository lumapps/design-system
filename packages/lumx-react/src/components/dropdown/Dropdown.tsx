import React, { cloneElement, forwardRef, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { List, ListProps } from '@lumx/react/components/list/List';
import { Offset, Placement, Popover } from '@lumx/react/components/popover/Popover';
import { useInfiniteScroll } from '@lumx/react/hooks/useInfiniteScroll';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface DropdownProps extends GenericProps {
    /** Reference to the element around which the dropdown is placed.
     * @see {@link PopoverProps#anchorRef}
     */
    anchorRef: React.RefObject<HTMLElement>;
    /** Dropdown content. */
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
     * Offset applied to the Dropdown position.
     * @see {@link PopoverProps#offset}
     */
    offset?: Offset;
    /**
     * Preferred Dropdown placement against the anchor element.
     * @see {@link PopoverProps#placement}
     */
    placement?: Placement;
    /** Whether the focus should be set on the list when the dropdown is open or not. */
    shouldFocusOnOpen?: boolean;
    /**
     * Z-axis position.
     * @see {@link PopoverProps#zIndex}
     */
    zIndex?: number;
    /**
     * On close callback.
     * @see {@link PopoverProps#onClose}
     */
    onClose?(): void;
    /** On scroll end callback. */
    onInfiniteScroll?(): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Dropdown';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
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
 * Dropdown component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Dropdown: Comp<DropdownProps, HTMLDivElement> = forwardRef((props, ref) => {
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
    const innerRef = useRef<HTMLDivElement>(null);
    const listElement = useRef(null);

    useInfiniteScroll(innerRef, onInfiniteScroll);

    const popperElement = useMemo(() => {
        return !Array.isArray(children) && isComponent(List)(children)
            ? cloneElement<ListProps>(children, {
                  ...children.props,
                  ref: listElement,
                  onClick(evt: MouseEvent) {
                      children.props.onClick?.(evt);

                      if (closeOnClick) {
                          onClose?.();
                      }
                  },
                  isClickable: true,
              })
            : children;
    }, [children, closeOnClick, onClose]);

    return isOpen ? (
        <Popover
            ref={ref}
            {...forwardedProps}
            anchorRef={anchorRef}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
            elevation={0 as any}
            closeOnClickAway={closeOnClickAway}
            closeOnEscape={closeOnEscape}
            fitToAnchorWidth={fitToAnchorWidth}
            fitWithinViewportHeight={fitWithinViewportHeight}
            focusElement={shouldFocusOnOpen ? listElement : undefined}
            isOpen={isOpen}
            offset={offset}
            onClose={onClose}
            placement={placement}
            zIndex={zIndex}
        >
            <div className={`${CLASSNAME}__menu`} ref={innerRef}>
                {popperElement}
            </div>
        </Popover>
    ) : null;
});
Dropdown.displayName = COMPONENT_NAME;
Dropdown.className = CLASSNAME;
Dropdown.defaultProps = DEFAULT_PROPS;
