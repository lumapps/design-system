import React, { useEffect, useRef } from 'react';

import classNames from 'classnames';

import { Offset, Placement, Popover } from 'LumX/components/popover/react/Popover';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { useClickAway } from 'LumX/core/react/hooks';
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
    escapeClose?: boolean;
    /** Vertical and/or horizontal offsets that will be applied to the Dropdown position. */
    offset?: Offset;
    /** The preferred Dropdown location against the anchor element. */
    placement?: Placement;
    /** Whether the dropdown should be displayed or not. Useful to control the Dropdown from outside the component. */
    showDropdown: boolean;
    /** Children of the Dropdown. */
    children: React.ReactNode;
    /** The function to be called when the user clicks away or Escape is pressed */
    onClose?: VoidFunction;
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
    escapeClose: true,
    placement: Placement.BOTTOM_START,
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
    escapeClose = DEFAULT_PROPS.escapeClose,
    offset,
    showDropdown,
    anchorRef,
    placement = DEFAULT_PROPS.placement,
    ...props
}: DropdownProps): React.ReactElement => {
    const wrapperRef: React.RefObject<HTMLDivElement> = useRef(null);
    const popoverRef: React.RefObject<HTMLDivElement> = useRef(null);

    const { computedPosition, isVisible } = Popover.useComputePosition(
        placement!,
        anchorRef,
        popoverRef,
        showDropdown,
        offset,
        true,
    );

    const popperElement: React.ReactElement = (
        <div ref={wrapperRef} className={`${CLASSNAME}__menu`} style={{ width: computedPosition.width }}>
            <div className={`${CLASSNAME}__content`}>{children}</div>
        </div>
    );

    useEffect(() => {
        if (escapeClose && showDropdown && wrapperRef.current) {
            window.addEventListener('keydown', onEscapePressed(onClose!));
        } else {
            window.removeEventListener('keydown', onEscapePressed(onClose!));
        }
        return (): void => {
            window.removeEventListener('keydown', onEscapePressed(onClose!));
        };
    }, [showDropdown, escapeClose]);

    // Any click away from the dropdown container will close it.
    useClickAway(
        wrapperRef,
        () => {
            if (!closeOnClick || !onClose) {
                return;
            }

            onClose();
        },
        [anchorRef!],
    );

    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            <Popover
                popoverRect={computedPosition}
                popoverRef={popoverRef}
                isVisible={isVisible}
                offset={offset}
                placement={placement}
            >
                {popperElement}
            </Popover>
        </div>
    );
};
Dropdown.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Dropdown, DropdownProps };
