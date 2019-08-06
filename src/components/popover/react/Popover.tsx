import React, { CSSProperties, ReactChild, ReactElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { useComputePosition } from 'LumX/core/react/hooks';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { isInViewPort } from 'LumX/core/react/utils/isInViewPort';
import { handleBasicClasses } from 'LumX/core/utils';

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
interface IOffsets {
    vertical?: number;
    horizontal?: number;
}
type Offsets = IOffsets;

/**
 * Position for arrow or tooltip.
 */
interface IElementPosition {
    x: number;
    y: number;
    width?: number;
    height?: number;
}
type ElementPosition = IElementPosition;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IPopoverProps extends IGenericProps {
    /* The reference element that will be used as the anchor. */
    anchorRef: React.RefObject<HTMLElement>;
    /* Children element displayed inside popover. */
    children: ReactChild;
    /* How high the component is flying */
    elevation?: number;
    /* Force the popper width to match the anchor's. */
    hasParentWidth?: boolean;
    /* Vertical and/or horizontal offsets that will be applied to the popper position. */
    offset?: Offsets;
    /* Should the popper be displayed ? */
    isVisible?: boolean | (() => boolean);
    /* The prefered popover location against the anchor. */
    placement?: Placement;
}
type PopoverProps = IPopoverProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<PopoverProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    elevation: 3,
    placement: Placement.TOP,
};

/////////////////////////////

/**
 * Popover.
 *
 * @return The component.
 */
const Popover: React.FC<PopoverProps> = ({
    anchorRef,
    children,
    className = '',
    elevation = DEFAULT_PROPS.elevation,
    isVisible,
    hasParentWidth,
    offset,
    placement = DEFAULT_PROPS.placement,
    ...props
}: PopoverProps): ReactElement | null => {
    if (!anchorRef || !anchorRef.current) {
        return null;
    }

    // Handle mouse over the popover to prevent it from closing from outside (infinite mouse event bug).
    const [isMouseEntered, setIsMouseEntered] = useState(false);

    const isAnchorInViewport = isInViewPort(anchorRef.current.getBoundingClientRect(), 'partial');

    const popoverRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const { height, width, x, y }: ElementPosition = useComputePosition(
        placement!,
        anchorRef,
        popoverRef,
        offset,
        hasParentWidth,
        false,
        [placement, anchorRef, popoverRef, isVisible, isMouseEntered],
    );

    const cssPopover: CSSProperties = {
        display: isAnchorInViewport && (isVisible || isMouseEntered) ? 'block' : 'none',
        height: height ? `${height}px` : 'auto',
        left: 0,
        position: 'absolute',
        top: 0,
        transform: `translate(${x}px, ${y}px)`,
        width: width ? `${width}px` : 'auto',
        zIndex: 9999,
    };

    /**
     * Handle mouse entering the popover.
     */
    const handleMouseEnter = (): void => {
        setIsMouseEntered(true);
    };

    /**
     * Handle mouse leaving the popover.
     */
    const handleMouseLeave = (): void => {
        setIsMouseEntered(false);
    };

    useEffect(() => {
        if (isVisible || isMouseEntered) {
            popoverRef.current!.addEventListener('mouseenter', handleMouseEnter);
            popoverRef.current!.addEventListener('mouseleave', handleMouseLeave);
        }

        return (): void => {
            popoverRef.current!.removeEventListener('mouseenter', handleMouseEnter);
            popoverRef.current!.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isAnchorInViewport, isVisible, isMouseEntered, handleMouseEnter, handleMouseLeave]);

    return createPortal(
        <div
            ref={popoverRef}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, elevation: elevation && elevation > 5 ? 5 : elevation }),
            )}
            {...props}
            style={cssPopover}
            x-placement={placement}
        >
            <div className={`${CLASSNAME}__wrapper`}>{children}</div>
        </div>,
        document.body,
    );
};
Popover.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Popover, PopoverProps, Placement, ElementPosition, Offsets };
