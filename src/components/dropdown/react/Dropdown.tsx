import React, { ReactNode, useState } from 'react';

import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';

import { IPopperOffsets, Popover, PopperPositions } from 'LumX/components/popover/react/Popover';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { handleBasicClasses } from 'LumX/core/utils';
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
    offset?: IPopperOffsets;
    /** Whether the dropdown is displayed on top of the toggle itself or sits next to it. */
    overToggle?: boolean;
    /** The preferred Dropdown location against the toggle element. */
    position?: PopperPositions | string;
    /** The reference element that will be used as the toggle of the Dropdown. */
    toggleElement: ReactNode;
    /** The width of the dropdown container. */
    width?: number;
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
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////

/**
 * Displays a dropdown.
 *
 * @return The component.
 */
const Dropdown: React.FC<DropdownProps> = ({
    children,
    className = '',
    closeOnClick = true,
    escapeClose = true,
    offset,
    // overToggle = false,
    position,
    toggleElement,
    width,
}: DropdownProps): React.ReactElement => {
    const [isOpen, setIsOpen]: [boolean, (isOpen: boolean) => void] = useState(Boolean(false));

    function toggleDropdown(): void {
        setIsOpen(!isOpen);
    }

    const anchorElement: ReactNode = (
        <div className={`${CLASSNAME}__toggle`} onClick={toggleDropdown}>
            {toggleElement}
        </div>
    );

    const popperElement: ReactNode = isOpen && (
        <FocusTrap
            focusTrapOptions={{
                clickOutsideDeactivates: closeOnClick,
                escapeDeactivates: escapeClose,
                fallbackFocus: `.${CLASSNAME}`,
                onDeactivate: (): void => {
                    setIsOpen(false);
                },
                returnFocusOnDeactivate: true,
            }}
        >
            <div className={`${CLASSNAME}__menu`} style={{ width }}>
                <div className={`${CLASSNAME}__content`}>{children(setIsOpen)}</div>
            </div>
        </FocusTrap>
    );

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }), {
                [`${CLASSNAME}--has-toggle`]: toggleElement,
            })}
        >
            <Popover
                anchorElement={anchorElement}
                showPopper={isOpen}
                popperElement={popperElement}
                popperOffset={offset}
                popperPlacement={position}
            />
        </div>
    );
};
Dropdown.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Dropdown, DropdownProps };
