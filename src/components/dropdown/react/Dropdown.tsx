import React, { useEffect, useRef, useState } from 'react';

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
    /** Whether a click anywhere out of the Dropdown would close it. */
    closeOnClick?: boolean;
    /** Whether an escape key press would close the Dropdown. */
    escapeClose?: boolean;
    /** Vertical and/or horizontal offsets that will be applied to the Dropdown position. */
    offset?: Offset;
    /** The preferred Dropdown location against the toggle element. */
    position?: Placement | string;
    /** Whether the dropdown should be displayed or not. Useful to control the Dropdown from outside the component. */
    showDropdown?: boolean | undefined;
    /** The reference element that will be used as the toggle of the Dropdown. */
    toggleElement: React.ReactNode;
    /** The width of the dropdown container. */
    width?: number;
    /** A render prop that returns the content of the Dropdown. */
    children(setIsOpen: (isOpen: boolean) => void): React.ReactNode;
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
    closeOnClick = DEFAULT_PROPS.closeOnClick,
    escapeClose = DEFAULT_PROPS.escapeClose,
    offset,
    showDropdown = DEFAULT_PROPS.showDropdown,
    toggleElement,
    width,
    ...props
}: DropdownProps): React.ReactElement => {
    const wrapperRef: React.RefObject<HTMLDivElement> = useRef(null);
    const popoverRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [isOpen, setIsOpen]: [boolean, (isOpen: boolean) => void] = useState<boolean>(showDropdown || false);

    function closeDropdown(): void {
        setIsOpen(false);
    }

    function toggleDropdown(): void {
        setIsOpen(!isOpen);
    }

    const anchorElement: React.ReactNode = (
        <div className={`${CLASSNAME}__toggle`} onClick={toggleDropdown}>
            {toggleElement}
        </div>
    );

    const popperElement: React.ReactNode = (
        <div className={`${CLASSNAME}__menu`} style={{ width }}>
            <div className={`${CLASSNAME}__content`}>{children(setIsOpen)}</div>
        </div>
    );

    // Control the dropdown from the outside via the showDropdown prop.
    useEffect((): void => {
        if (showDropdown === undefined) {
            return;
        }

        setIsOpen(showDropdown);
    }, [showDropdown]);

    // Any click away from the dropdown container will close it.
    useClickAway(wrapperRef, () => {
        if (!closeOnClick) {
            return;
        }

        closeDropdown();
    });

    return (
        <>
            <div
                className={classNames(
                    className,
                    handleBasicClasses({ prefix: CLASSNAME, hasToggle: toggleElement !== null }),
                )}
                ref={wrapperRef}
                onKeyDown={escapeClose ? onEscapePressed(closeDropdown) : null}
                {...props}
            >
                {anchorElement}
            </div>
            <Popover
                popoverRect={{ x: 0, y: 0, height: 0, width: 0 }}
                isVisible={isOpen}
                popoverRef={popoverRef}
                offset={offset}
            >
                <div>{popperElement}</div>
            </Popover>
        </>
    );
};
Dropdown.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Dropdown, DropdownProps };
