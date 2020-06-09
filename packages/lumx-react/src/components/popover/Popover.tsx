import React, { ReactChild } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Different possible placements for the popover.
 */
enum Placement {
    AUTO = 'auto',
    AUTO_END = 'auto-end',
    AUTO_START = 'auto-start',

    TOP = 'top',
    TOP_END = 'top-end',
    TOP_START = 'top-start',

    RIGHT = 'right',
    RIGHT_END = 'right-end',
    RIGHT_START = 'right-start',

    BOTTOM = 'bottom',
    BOTTOM_END = 'bottom-end',
    BOTTOM_START = 'bottom-start',

    LEFT = 'left',
    LEFT_END = 'left-end',
    LEFT_START = 'left-start',
}

/**
 * Vertical and horizontal offset of the popover.
 */
interface Offset {
    vertical?: number;
    horizontal?: number;
}

/**
 * Defines the props of the component.
 */
interface PopoverProps extends GenericProps {
    /** The reference of the anchor. */
    anchorRef: React.RefObject<HTMLDivElement>;
    /** The desired placement */
    placement: Placement;
    /** Should the popper be displayed. */
    isVisible: boolean;
    /** Children element displayed inside popover. */
    children: ReactChild;
    /** How high the component is flying */
    elevation?: number;
    /** The classname to apply to the Popover wrapper */
    className?: string;
    /** The z-axis position. */
    zIndex?: number;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<PopoverProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Popover`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    className: '',
    elevation: 3,
    placement: Placement.TOP,
    zIndex: 9999,
};

/**
 * Popover.
 *
 * @return The component.
 */
const Popover: React.FC<PopoverProps> = ({
    anchorRef,
    placement,
    children,
    className = DEFAULT_PROPS.className,
    elevation = DEFAULT_PROPS.elevation,
    isVisible,
    zIndex = DEFAULT_PROPS.zIndex,
    ...props
}) => {
    const [popperElement, setPopperElement] = React.useState<null | HTMLElement>(null);
    const { styles, attributes } = usePopper(anchorRef.current, popperElement, {
        placement,
    });
    console.log(styles, attributes);

    return createPortal(
        <div
            ref={setPopperElement}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, elevation: Math.min(elevation || 0, 5) }),
            )}
            style={styles.popper}
            {...attributes.popper}
        >
            <div className={`${CLASSNAME}__wrapper`}>{children}</div>
        </div>,
        document.body,
    );
};
Popover.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Popover, PopoverProps, Placement, Offset };
