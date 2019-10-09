import React, { CSSProperties, ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { Placement } from 'LumX';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/** Position of the tooltip relative to the anchor element. */
type TooltipPlacement = Placement.TOP | Placement.RIGHT | Placement.BOTTOM | Placement.LEFT;

/**
 * Position for arrow or tooltip.
 */
interface IPosition {
    x: number;
    y: number;
}
type Position = IPosition;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITooltipProps extends IGenericProps {
    /** Ref of anchor element. */
    anchorRef: RefObject<HTMLElement>;

    /** Delay in ms before closing the tooltip . */
    delay?: number;

    /** Placement of tooltip relative to the anchor element. */
    placement?: TooltipPlacement;
}
type TooltipProps = ITooltipProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TooltipProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Tooltip`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    delay: 500,
    placement: Placement.BOTTOM,
};

/**
 * The offset from the target.
 */
const OFFSET = 8;

/////////////////////////////

/**
 * Calculate the position of the tooltip relative to the anchor element.
 *
 * @param placement Placement of tooltip.
 * @param anchorRef Ref of anchor element.
 * @param tooltipRef Ref of tooltip.
 * @param [dependencies=[placement, anchorRef, tooltipRef]] Dependencies of hook.
 * @return Position of the tooltip relative to the anchor element.
 */
const useTooltipPosition = (
    placement: TooltipPlacement,
    anchorRef: RefObject<HTMLElement>,
    tooltipRef: RefObject<HTMLDivElement>,
    // tslint:disable-next-line: no-any
    dependencies: any[] = [placement, anchorRef, tooltipRef],
): Position => {
    const [position, setPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    useEffect((): void => {
        if (!anchorRef || !anchorRef.current || !tooltipRef || !tooltipRef.current) {
            return;
        }

        const { top, left, width, height } = anchorRef.current!.getBoundingClientRect();
        const {
            width: widthTooltip,
            height: heightTooltip,
        }: ClientRect | DOMRect = tooltipRef.current!.getBoundingClientRect();

        switch (placement) {
            case Placement.TOP:
                setPosition({ x: left + (width - widthTooltip) / 2, y: top - heightTooltip - OFFSET });

                break;
            case Placement.RIGHT:
                setPosition({ x: left + width + OFFSET, y: top + (height - heightTooltip) / 2 });

                break;
            case Placement.BOTTOM:
                setPosition({ x: left + (width - widthTooltip) / 2, y: top + height + OFFSET });

                break;
            case Placement.LEFT:
                setPosition({ x: left - widthTooltip - OFFSET, y: top + (height - heightTooltip) / 2 });

                break;

            default:
                setPosition({ x: 0, y: 0 });

                break;
        }
    }, dependencies);

    return position;
};

/**
 * Tooltip.
 *
 * @return The component.
 */
const Tooltip: React.FC<TooltipProps> = ({
    anchorRef,
    children,
    className,
    delay = DEFAULT_PROPS.delay,
    placement = DEFAULT_PROPS.placement,
    ...props
}: TooltipProps): ReactElement => {
    const [timer, setTimer] = useState(0);
    const tooltipRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Handle mouse over anchor element.
     */
    const handleMouseEnter = (): void => {
        const id: number = setTimeout(() => {
            setIsOpen(true);
        }, delay);

        setTimer(id);
    };

    /**
     * Handle mouse out anchor element.
     */
    const handleMouseLeave = (): void => {
        if (timer) {
            clearTimeout(timer);
            setTimer(0);
        }

        setIsOpen(false);
    };

    useEffect(() => {
        if (anchorRef && anchorRef.current && tooltipRef && tooltipRef.current) {
            anchorRef.current.addEventListener('mouseenter', handleMouseEnter);
            anchorRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return (): void => {
            if (anchorRef && anchorRef.current) {
                anchorRef.current.removeEventListener('mouseenter', handleMouseEnter);
                anchorRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [anchorRef, tooltipRef, timer]);

    const tooltipPosition: Position = useTooltipPosition(placement!, anchorRef, tooltipRef, [
        placement,
        anchorRef,
        tooltipRef,
        isOpen,
    ]);

    const cssTooltip: CSSProperties = {
        transform: `translate3d(${tooltipPosition.x}px, ${tooltipPosition.y}px, 0px)`,
        visibility: isOpen ? 'visible' : 'hidden',
    };

    return createPortal(
        <div
            ref={tooltipRef}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME }),
                `${CLASSNAME}--position-${placement}`,
            )}
            {...props}
            style={cssTooltip}
        >
            <div className={`${CLASSNAME}__arrow`} />
            <div className={`${CLASSNAME}__inner`}>{children}</div>
        </div>,
        document.body,
    );
};
Tooltip.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Tooltip, TooltipPlacement, TooltipProps };
