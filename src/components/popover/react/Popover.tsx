import React, { CSSProperties, ReactChild, ReactElement, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

import { handleBasicClasses } from 'LumX/core/utils';

import { createPortal } from 'react-dom';

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
interface IPosition {
    x: number;
    y: number;
    width?: number;
    height?: number;
}
type Position = IPosition;

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

type ViewPortVisibility = 'full' | 'partial';

const isInViewPort = (bounding: ClientRect | DOMRect, visibility: ViewPortVisibility): boolean => {
    if (visibility === 'partial') {
        return (
            bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            bounding.right >= 0 &&
            bounding.bottom >= 0
        );
    }

    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
};

/**
 * Calculate the position of the popover relative to the anchor element.
 *
 * @param placement Placement of tooltip.
 * @param anchorRef Ref of anchor element.
 * @param popoverRef Ref of tooltip.
 * @param [offset] Ref of tooltip.
 * @param [hasParentWidth] Whether component has to match parent width.
 * @param [hasParentHeight] Whether component has to match parent height.
 * @param [dependencies] Dependencies of hook.
 * @return Position of the popover relative to the anchor element.
 */
const useComputePosition: (
    placement: Placement,
    anchorRef: React.RefObject<HTMLElement>,
    popoverRef: React.RefObject<HTMLDivElement>,
    offset?: Offsets,
    hasParentWidth?: boolean,
    hasParentHeight?: boolean,
    // tslint:disable-next-line: no-any
    dependencies?: any[],
) => Position = (
    placement: Placement,
    anchorRef: React.RefObject<HTMLElement>,
    popoverRef: React.RefObject<HTMLDivElement>,
    offset: Offsets = { horizontal: 0, vertical: 0 },
    hasParentWidth?: boolean,
    hasParentHeight?: boolean,
    // tslint:disable-next-line: no-any
    dependencies: any[] = [placement, anchorRef, popoverRef],
): Position => {
    const [position, setPosition] = useState<Position>({
        height: 0,
        width: 0,
        x: 0,
        y: 0,
    });

    useEffect((): void => {
        if (!anchorRef || !anchorRef.current || !popoverRef || !popoverRef.current) {
            return;
        }

        const { top, left, width: widthAnchor, height: heightAnchor } = anchorRef.current!.getBoundingClientRect();
        const {
            width: widthPopover,
            height: heightPopover,
        }: ClientRect | DOMRect = popoverRef.current!.getBoundingClientRect();

        const splittedPlacement = placement.split('-');
        const verticalPlacement = splittedPlacement[0];
        const horizontalPlacement = splittedPlacement[1];

        const { horizontal = 0, vertical = 0 } = offset;

        const newPosition: Position = {
            height: hasParentHeight ? heightAnchor : heightPopover,
            width: hasParentWidth ? widthAnchor : widthPopover,
            x: horizontal,
            y: vertical,
        };

        switch (verticalPlacement) {
            case 'top':
                newPosition.y += top - heightPopover;

                switch (horizontalPlacement) {
                    case 'start':
                        newPosition.x += left;

                        break;
                    case 'end':
                        newPosition.x += left + widthAnchor - widthPopover;

                        break;

                    default:
                        newPosition.x += left + (widthAnchor - widthPopover) / 2;

                        break;
                }

                break;
            case 'right':
                newPosition.x += left + widthAnchor;

                switch (horizontalPlacement) {
                    case 'start':
                        newPosition.y += top;

                        break;
                    case 'end':
                        newPosition.y += top + heightAnchor - heightPopover;

                        break;

                    default:
                        newPosition.y += top + (heightAnchor - heightPopover) / 2;

                        break;
                }

                break;
            case 'bottom':
                newPosition.y += top + heightAnchor;

                switch (horizontalPlacement) {
                    case 'start':
                        newPosition.x += left;

                        break;
                    case 'end':
                        newPosition.x += left + widthAnchor - widthPopover;

                        break;

                    default:
                        newPosition.x += left + (widthAnchor - widthPopover) / 2;

                        break;
                }

                break;
            case 'left':
                newPosition.x += left - widthPopover;

                switch (horizontalPlacement) {
                    case 'start':
                        newPosition.y += top;

                        break;
                    case 'end':
                        newPosition.y += top + heightAnchor - heightPopover;

                        break;

                    default:
                        newPosition.y += top + (heightAnchor - heightPopover) / 2;

                        break;
                }

                break;

            default:
                break;
        }

        setPosition(newPosition);
    }, dependencies);

    return position;
};

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

    // Fake state to force re-rendering.
    const [value, set] = useState(true);

    // Handle mouse over the popover to prevent it from closing from outside (infinite mouse event bug).
    const [isMouseEntered, setIsMouseEntered] = useState(false);

    const isAnchorInViewport = isInViewPort(anchorRef.current.getBoundingClientRect(), 'partial');

    const popoverRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const { height, width, x, y }: Position = useComputePosition(
        placement!,
        anchorRef,
        popoverRef,
        offset,
        hasParentWidth,
        false,
        [placement, anchorRef, popoverRef, isVisible, isMouseEntered, value],
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
     * Handle window scroll event to force the component to rerender.
     */
    const handleScroll = (): void => {
        set(!value);
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
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);
            popoverRef.current!.addEventListener('mouseenter', handleMouseEnter);
            popoverRef.current!.addEventListener('mouseleave', handleMouseLeave);
        }

        return (): void => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
            popoverRef.current!.removeEventListener('mouseenter', handleMouseEnter);
            popoverRef.current!.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isAnchorInViewport, isVisible, isMouseEntered, handleScroll, handleMouseEnter, handleMouseLeave]);

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

export { CLASSNAME, DEFAULT_PROPS, Popover, PopoverProps, Placement, Offsets };
