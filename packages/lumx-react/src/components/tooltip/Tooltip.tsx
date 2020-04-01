import React, { CSSProperties, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { Offset, Placement, Popover } from '@lumx/react/components/popover/Popover';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/** Position of the tooltip relative to the anchor element. */
type TooltipPlacement = Placement.TOP | Placement.RIGHT | Placement.BOTTOM | Placement.LEFT;

/**
 * Defines the props of the component.
 */
interface TooltipProps extends GenericProps {
    /** Ref of anchor element. */
    anchorRef: RefObject<HTMLElement>;

    /** Delay in ms before closing the tooltip . */
    delay?: number;

    /** Placement of tooltip relative to the anchor element. */
    placement?: TooltipPlacement;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<TooltipProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    delay: 500,
    placement: Placement.BOTTOM,
};

/**
 * The offset from the target.
 */
const OFFSET = 8;

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
}) => {
    const [timer, setTimer] = useState(0);
    const tooltipRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Handle mouse over anchor element.
     */
    const handleMouseEnter = () => {
        const id: number = setTimeout(() => {
            setIsOpen(true);
        }, delay);

        setTimer(id);
    };

    /**
     * Handle mouse out anchor element.
     */
    const handleMouseLeave = () => {
        if (timer) {
            clearTimeout(timer);
            setTimer(0);
        }

        setIsOpen(false);
    };

    const computeOffset = (): Offset => {
        switch (placement) {
            case Placement.TOP:
                return {
                    horizontal: 0,
                    vertical: -OFFSET,
                };

            case Placement.BOTTOM:
                return {
                    horizontal: 0,
                    vertical: OFFSET,
                };

            case Placement.LEFT:
                return {
                    horizontal: -OFFSET,
                    vertical: 0,
                };

            case Placement.RIGHT:
                return {
                    horizontal: OFFSET,
                    vertical: 0,
                };

            default:
                return {
                    horizontal: 0,
                    vertical: 0,
                };
        }
    };

    useEffect(() => {
        if (anchorRef && anchorRef.current && tooltipRef && tooltipRef.current) {
            anchorRef.current.addEventListener('mouseenter', handleMouseEnter);
            anchorRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (anchorRef && anchorRef.current) {
                anchorRef.current.removeEventListener('mouseenter', handleMouseEnter);
                anchorRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [anchorRef, tooltipRef, timer]);

    const offsets = computeOffset();

    const { computedPosition, isVisible } = Popover.useComputePosition(
        placement!,
        anchorRef,
        tooltipRef,
        isOpen,
        offsets,
    );

    const tooltipStyles: CSSProperties = useMemo(
        () => ({
            display: isVisible ? 'block' : 'none',
            position: 'fixed',
            transform: `translate3d(${Math.round(computedPosition.x)}px, ${Math.round(computedPosition.y)}px, 0)`,
        }),
        [isVisible, computedPosition],
    );

    return createPortal(
        <div
            ref={tooltipRef}
            style={tooltipStyles}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME }),
                `${CLASSNAME}--position-${placement}`,
            )}
            {...props}
        >
            <div className={`${CLASSNAME}__arrow`} />
            <div className={`${CLASSNAME}__inner`}>{children}</div>
        </div>,
        document.body,
    );
};
Tooltip.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Tooltip, TooltipPlacement, TooltipProps };
