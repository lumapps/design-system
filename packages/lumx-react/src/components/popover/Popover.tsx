import React, { CSSProperties, ReactChild, ReactElement } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { useComputePosition, useComputePositionType } from '@lumx/react/hooks';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

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
interface IOffset {
    vertical?: number;
    horizontal?: number;
}
type Offset = IOffset;

/**
 * Position for arrow or tooltip.
 */
interface IElementPosition {
    x: number;
    y: number;
    width?: number;
    height?: number;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    anchorHeight?: number;
    anchorWidth?: number;
}
type ElementPosition = IElementPosition;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IPopoverProps extends IGenericProps {
    /** The position the popover should be bounded to. */
    popoverRect: ElementPosition;
    /** Should the popper be displayed. */
    isVisible: boolean;
    /** The reference forwarded to the popover container. */
    popoverRef: React.RefObject<HTMLDivElement>;
    /** Children element displayed inside popover. */
    children: ReactChild;
    /** How high the component is flying */
    elevation?: number;
    /** The classname to apply to the Popover wrapper */
    className?: string;
    /** The z-axis position. */
    zIndex?: number;
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
    className: '',
    elevation: 3,
    placement: Placement.TOP,
    zIndex: 9999,
};

/////////////////////////////
interface IPopover {
    useComputePosition: useComputePositionType;
}
/**
 * Popover.
 *
 * @return The component.
 */
const Popover: React.FC<PopoverProps> & IPopover = ({
    popoverRect,
    popoverRef,
    children,
    className = DEFAULT_PROPS.className,
    elevation = DEFAULT_PROPS.elevation,
    isVisible,
    zIndex = DEFAULT_PROPS.zIndex,
    ...props
}: PopoverProps): ReactElement => {
    /**
     * Depending on which is assigned first, the `popoverRect` or `popoverRef`,
     * there are scenarios where the reference to the popover is still not assigned,
     * which makes the popover to be shown at (0,0), then it moves under the anchor.
     * Since the position is calculated with a `useEffect`, the first time it is calculated,
     * `popoverRef` is still not defined, and the hook defaults to a (0,0) position. Once the reference
     * is set and the `useEffect` has the `popoverRef` as dependency, it can recalculate the position and
     * provide the accurate one. In order to fix this border case, we simply state that, for the popover
     * to be visible, `isVisible` needs to be true and the ref needs to be defined.
     */
    const isPopoverVisible = isVisible && popoverRef && popoverRef.current;

    const cssPopover: CSSProperties = {
        left: 0,
        position: 'fixed',
        top: 0,
        transform: `translate(${popoverRect.x}px, ${popoverRect.y}px)`,
        visibility: isPopoverVisible ? 'visible' : 'hidden',
        zIndex,
    };

    return createPortal(
        <div
            ref={popoverRef}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, elevation: elevation && elevation > 5 ? 5 : elevation }),
            )}
            {...props}
            style={cssPopover}
        >
            <div className={`${CLASSNAME}__wrapper`}>{children}</div>
        </div>,
        document.body,
    );
};
Popover.displayName = COMPONENT_NAME;
Popover.useComputePosition = useComputePosition;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Popover, PopoverProps, Placement, ElementPosition, Offset };
