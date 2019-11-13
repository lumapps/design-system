import React, { useEffect, useRef } from 'react';

import classNames from 'classnames';

import { Offset, Placement, Popover } from 'LumX/components/popover/react/Popover';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { useClickAway, useInfiniteScroll } from 'LumX/core/react/hooks';
import { handleBasicClasses, onEscapePressed } from 'LumX/core/utils';
import { IGenericProps, getRootClassName } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IDropdownProps extends IGenericProps {
    /** The reference of the DOM element used to set the position of the Dropdown. */
    anchorRef: React.RefObject<HTMLElement>;
    /** Whether a click anywhere out of the Dropdown would close it. */
    closeOnClick?: boolean;
    /** Whether an escape key press would close the Dropdown. */
    closeOnEscape?: boolean;
    /** Vertical and/or horizontal offsets that will be applied to the Dropdown position. */
    offset?: Offset;
    /** The preferred Dropdown location against the anchor element. */
    placement?: Placement;
    /** Whether the dropdown should be displayed or not. Useful to control the Dropdown from outside the component. */
    showDropdown: boolean;
    /** Whether the dropdown should fit to the anchor width */
    fitToAnchorWidth?: boolean;
    /** Children of the Dropdown. */
    children: React.ReactNode;
    /** The function to be called when the user clicks away or Escape is pressed */
    onClose?: VoidFunction;
    /**
     * The callback function called when the bottom of the dropdown is reached.
     */
    onInfinite?: VoidFunction;
}
type DropdownProps = IDropdownProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<DropdownProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    closeOnClick: true,
    closeOnEscape: true,
    fitToAnchorWidth: true,
    placement: Placement.AUTO_START,
    showDropdown: undefined,
};

/////////////////////////////

/**
 * Displays a dropdown.
 *
 * @return The component.
 */
const Dropdown: React.FC<DropdownProps> = ({
    children,
    className = '',
    onClose,
    closeOnClick = DEFAULT_PROPS.closeOnClick,
    closeOnEscape = DEFAULT_PROPS.closeOnEscape,
    offset,
    showDropdown,
    anchorRef,
    placement = DEFAULT_PROPS.placement,
    fitToAnchorWidth = DEFAULT_PROPS.fitToAnchorWidth,
    onInfiniteScroll,
    ...props
}: DropdownProps): React.ReactElement | null => {
    const wrapperRef: React.RefObject<HTMLDivElement> = useRef(null);
    const popoverRef: React.RefObject<HTMLDivElement> = useRef(null);

    const { computedPosition, isVisible } = Popover.useComputePosition(
        placement!,
        anchorRef,
        popoverRef,
        showDropdown,
        offset,
        false,
        fitToAnchorWidth,
    );

    if (onInfiniteScroll) {
        useInfiniteScroll(wrapperRef, onInfiniteScroll);
    }

    const popperElement: React.ReactElement = (
        <div
            className={classNames(className, `${CLASSNAME}__menu`, handleBasicClasses({ prefix: CLASSNAME }))}
            ref={wrapperRef}
            style={{
                maxHeight: computedPosition.maxHeight,
                minWidth: computedPosition.anchorWidth,
            }}
            {...props}
        >
            <div className={`${CLASSNAME}__content`}>{children}</div>
        </div>
    );

    const onEscapeHandler = closeOnEscape && onClose && showDropdown && onEscapePressed(onClose);

    useEffect(() => {
        if (!onEscapeHandler || !wrapperRef.current) {
            return undefined;
        }
        if (closeOnEscape && showDropdown && wrapperRef.current) {
            window.addEventListener('keydown', onEscapeHandler);
        }
        return (): void => {
            window.removeEventListener('keydown', onEscapeHandler);
        };
    }, [showDropdown, closeOnEscape, onClose]);

    // Any click away from the dropdown container will close it.
    useClickAway(
        wrapperRef,
        () => {
            if (!closeOnClick || !onClose || !showDropdown) {
                return;
            }

            onClose();
        },
        [anchorRef],
    );

    return showDropdown ? (
        <Popover
            popoverRect={computedPosition}
            popoverRef={popoverRef}
            isVisible={isVisible}
            offset={offset}
            placement={placement}
        >
            {popperElement}
        </Popover>
    ) : null;
};
Dropdown.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Dropdown, DropdownProps };
