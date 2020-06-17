import React, { ReactNode, useMemo, useState } from 'react';
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
interface OptionalPopoverProps extends GenericProps {
    /** The desired placement */
    placement?: Placement;
    /** The desired offset */
    offset?: Offset;
    /** How high the component is flying */
    elevation?: number;
    /** The z-axis position. */
    zIndex?: number;
    /** Whether the dropdown should fit to the anchor width */
    fitToAnchorWidth?: boolean;
}
interface PopoverProps extends OptionalPopoverProps {
    /** The reference of the anchor. */
    anchorRef: React.RefObject<HTMLElement>;
    /** Children element displayed inside popover. */
    children: ReactNode;
}

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
const DEFAULT_PROPS: Required<OptionalPopoverProps> = {
    elevation: 3,
    placement: Placement.AUTO,
    offset: {
        vertical: 0,
        horizontal: 0,
    },
    zIndex: 9999,
    fitToAnchorWidth: false,
};

/**
 * Popover.
 *
 * @return The component.
 */
const Popover: React.FC<PopoverProps> = (props) => {
    const {
        anchorRef,
        placement,
        children,
        fitToAnchorWidth = DEFAULT_PROPS.fitToAnchorWidth,
        offset = DEFAULT_PROPS.offset,
        elevation = DEFAULT_PROPS.elevation,
        zIndex = DEFAULT_PROPS.zIndex,
        className,
        ...forwardedProps
    } = props;
    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    const { styles, attributes } = usePopper(anchorRef.current, popperElement, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [offset.vertical, offset.horizontal],
                },
            },
        ],
    });

    const popoverStyle = useMemo(() => {
        if(!fitToAnchorWidth || !anchorRef.current) {
            return styles.popper;
        }

        const boundingAnchor = anchorRef.current.getBoundingClientRect();
        return {
            ...styles.popper,
            width: boundingAnchor.width,
        }
    }, [fitToAnchorWidth, anchorRef, styles]);

    return createPortal(
        <div
           {...forwardedProps}
            ref={setPopperElement}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, elevation: Math.min(elevation || 0, 5) }),
            )}
            style={popoverStyle}
            {...attributes.popper}
        >
            <div className={`${CLASSNAME}__wrapper`}>{children}</div>
        </div>,
        document.body,
    );
};
Popover.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Popover, PopoverProps, Placement, Offset };
