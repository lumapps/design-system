import React, { CSSProperties, ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/** Position of the tooltip relative to the anchor element. */
type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

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
    delay: 0,
    placement: 'bottom',
};

/////////////////////////////

/**
 * Calculate the position of the tooltip relative to the anchor element.
 *
 * @param placement Placement of tooltip.
 * @param anchorRef Ref of anchor element.
 * @param tooltipRef Ref of tooltip.
 * @param [dependencies=[placement, anchorRef, tooltipRef]] Dependencies of hook.
 * @return Position of the arrow on the tooltip.
 */
const useTooltipPosition: (
    placement: TooltipPlacement,
    anchorRef: React.RefObject<HTMLElement>,
    tooltipRef: React.RefObject<HTMLDivElement>,
    // tslint:disable-next-line: no-any
    dependencies?: any[],
) => Position = (
    placement: TooltipPlacement,
    anchorRef: React.RefObject<HTMLElement>,
    tooltipRef: React.RefObject<HTMLDivElement>,
    // tslint:disable-next-line: no-any
    dependencies: any[] = [placement, anchorRef, tooltipRef],
): Position => {
    const [position, setPosition]: [Position, React.Dispatch<React.SetStateAction<Position>>] = useState<Position>({
        x: 0,
        y: 0,
    });

    useEffect((): void => {
        if (!anchorRef || !anchorRef.current || !tooltipRef || !tooltipRef.current) {
            return;
        }

        const { top, left, width, height }: ClientRect | DOMRect = anchorRef.current!.getBoundingClientRect();
        const {
            width: widthTooltip,
            height: heightTooltip,
        }: ClientRect | DOMRect = tooltipRef.current!.getBoundingClientRect();
        switch (placement) {
            case 'top':
                setPosition({ x: left + (width - widthTooltip) / 2, y: top - height });

                break;
            case 'right':
                setPosition({ x: left + width, y: top + (height - heightTooltip) / 2 });

                break;
            case 'bottom':
                setPosition({ x: left + (width - widthTooltip) / 2, y: top + height });

                break;
            case 'left':
                setPosition({ x: left - widthTooltip - 8, y: top + (height - heightTooltip) / 2 });

                break;

            default:
                setPosition({ x: 0, y: 0 });

                break;
        }
    }, dependencies);

    return position;
};

/**
 * Calculate arrow position on the tooltip.
 *
 * @param placement Placement of tooltip.
 * @param tooltipRef Ref of tooltip.
 * @param [dependencies=[placement, tooltipRef]] Dependencies of hook.
 * @return Position of the arrow on the tooltip.
 */
const useArrowPosition: (
    placement: TooltipPlacement,
    tooltipRef: React.RefObject<HTMLDivElement>,
    // tslint:disable-next-line: no-any
    dependencies?: any[],
) => Position = (
    placement: TooltipPlacement,
    tooltipRef: React.RefObject<HTMLDivElement>,
    // tslint:disable-next-line: no-any
    dependencies: any[] = [placement, tooltipRef],
): Position => {
    const [position, setPosition]: [Position, React.Dispatch<React.SetStateAction<Position>>] = useState<Position>({
        x: 0,
        y: 0,
    });

    useEffect((): void => {
        if (!tooltipRef || !tooltipRef.current) {
            return;
        }

        const {
            width: widthTooltip,
            height: heightTooltip,
        }: ClientRect | DOMRect = tooltipRef.current!.getBoundingClientRect();
        const arrowHeight = 5;
        const arrowBorder = 5;
        const arrowWidth = 10;

        switch (placement) {
            case 'top':
            case 'bottom':
                setPosition({ x: widthTooltip / 2 - arrowWidth, y: 0 });

                break;
            case 'right':
            case 'left':
                setPosition({ x: 0, y: heightTooltip / 2 - arrowHeight - arrowBorder });

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
    className = '',
    delay = DEFAULT_PROPS.delay,
    placement = DEFAULT_PROPS.placement,
    ...props
}: TooltipProps): ReactElement => {
    const [timer, setTimer]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const tooltipRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    /**
     * Handle mouse over anchor element.
     */
    const handleMouseEnter: () => void = (): void => {
        if (timer) {
            clearTimeout(timer);
            setTimer(0);
        }

        setIsOpen(true);
    };

    /**
     * Handle mouse out anchor element.
     */
    const handleMouseLeave: () => void = (): void => {
        const id: number = setTimeout(() => {
            setIsOpen(false);
        }, delay);

        setTimer(id);
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
        left: 0,
        position: 'fixed',
        top: 0,
        transform: `translate3d(${tooltipPosition.x}px, ${tooltipPosition.y}px, 0px)`,
        visibility: isOpen ? 'visible' : 'hidden',
        willChange: 'transform',
        zIndex: 9999,
    };

    const arrowPosition: Position = useArrowPosition(placement!, tooltipRef, [placement, tooltipRef, isOpen]);
    const cssArrow: CSSProperties = {
        left: arrowPosition.x > 0 ? `${arrowPosition.x}px` : undefined,
        top: arrowPosition.y > 0 ? `${arrowPosition.y}px` : undefined,
    };

    return createPortal(
        <div
            ref={tooltipRef}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
            {...props}
            style={cssTooltip}
            x-placement={placement}
        >
            <div className={`${CLASSNAME}__arrow`} style={cssArrow} />
            <div className={`${CLASSNAME}__inner`}>{children}</div>
        </div>,
        document.body,
    );
};
Tooltip.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Tooltip, TooltipPlacement, TooltipProps };
