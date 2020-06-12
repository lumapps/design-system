import React, { cloneElement, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { List } from '@lumx/react/components/list/List';
import { Offset, Placement, Popover } from '@lumx/react/components/popover/Popover';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { useInfiniteScroll } from '@lumx/react/hooks/useInfiniteScroll';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';

/**
 * Defines the props of the component.
 */
interface DropdownProps extends GenericProps {
    /** The reference of the DOM element used to set the position of the Dropdown. */
    anchorRef: React.RefObject<HTMLElement>;
    /** Children of the Dropdown. */
    children: React.ReactNode;
    /** Whether a click anywhere out of the Dropdown would close it. */
    closeOnClick?: boolean;
    /** Whether an escape key press would close the Dropdown. */
    closeOnEscape?: boolean;
    /** Whether the dropdown should fit to the anchor width */
    fitToAnchorWidth?: boolean;
    /** Vertical and/or horizontal offsets that will be applied to the Dropdown position. */
    offset?: Offset;
    /** The preferred Dropdown location against the anchor element. */
    placement?: Placement;
    /** Whether the focus should be set on the list when the dropdown is open. */
    shouldFocusOnOpen?: boolean;
    /** Whether the dropdown should be displayed or not. Useful to control the Dropdown from outside the component. */
    showDropdown: boolean;
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
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<DropdownProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    closeOnClick: true,
    closeOnEscape: true,
    fitToAnchorWidth: true,
    placement: Placement.AUTO_START,
    shouldFocusOnOpen: true,
    showDropdown: undefined,
};

/**
 * Displays a dropdown.
 *
 * @return The component.
 */
const Dropdown: React.FC<DropdownProps> = ({
    anchorRef,
    children,
    className,
    closeOnClick = DEFAULT_PROPS.closeOnClick,
    closeOnEscape = DEFAULT_PROPS.closeOnEscape,
    fitToAnchorWidth = DEFAULT_PROPS.fitToAnchorWidth,
    offset,
    placement = DEFAULT_PROPS.placement,
    shouldFocusOnOpen = DEFAULT_PROPS.shouldFocusOnOpen,
    showDropdown,
    zIndex,
    onClose,
    onInfiniteScroll,
    ...props
}: DropdownProps): React.ReactElement | null => {
    const wrapperRef: React.RefObject<HTMLDivElement> = useRef(null);
    const listElementRef: React.RefObject<HTMLUListElement> = useRef(null);

    if (onInfiniteScroll) {
        useInfiniteScroll(wrapperRef, onInfiniteScroll);
    }

    const popperElement: React.ReactElement = useMemo(() => {
        const clonedChildren =
            !Array.isArray(children) && isComponent(List)(children)
                ? cloneElement(children, { ...children.props, listElementRef })
                : children;

        return (
            <div
                {...props}
                className={classNames(className, `${CLASSNAME}__menu`, handleBasicClasses({ prefix: CLASSNAME }))}
                ref={wrapperRef}
            >
                <div className={`${CLASSNAME}__content`}>{clonedChildren}</div>
            </div>
        );
    }, [listElementRef, wrapperRef, children, className, props]);

    useCallbackOnEscape(onClose, showDropdown && closeOnEscape);

    // Set the focus on the list when the dropdown opens,
    // in order to enable keyboard controls.
    useFocus(listElementRef.current, shouldFocusOnOpen);

    return showDropdown ? (
        <Popover
            anchorRef={anchorRef}
            placement={placement}
            offset={offset}
            zIndex={zIndex}
        >
            <ClickAwayProvider callback={closeOnClick && onClose} refs={[wrapperRef, anchorRef]}>
                {popperElement}
            </ClickAwayProvider>
        </Popover>
    ) : null;
};
Dropdown.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Dropdown, DropdownProps };
