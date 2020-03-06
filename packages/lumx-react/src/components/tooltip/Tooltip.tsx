import React, { CSSProperties, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { Offset, Placement, Popover } from '@lumx/react/components/popover/Popover';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/** Position of the tooltip relative to the anchor element. */
export type TooltipPlacement = Placement.TOP | Placement.RIGHT | Placement.BOTTOM | Placement.LEFT;

/**
 * Defines the props of the component.
 */
export interface TooltipProps extends GenericProps {
    /** Ref of anchor element. */
    anchorRef: RefObject<HTMLElement>;

    /** Delay in ms before closing the tooltip . */
    delay?: number;

    /** Placement of tooltip relative to the anchor element. */
    placement?: TooltipPlacement;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Tooltip`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<TooltipProps> = {
    delay: 500,
    placement: Placement.BOTTOM,
};

/**
 * The offset from the target.
 */
const OFFSET = 8;

// TODO: https://lumapps.atlassian.net/browse/LUM-8430
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * Tooltip.
 *
 * @return The component.
 */
export const Tooltip: React.FC<TooltipProps> = ({
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
        const anchor = anchorRef.current;
        const tooltip = tooltipRef.current;
        if (!anchor || !tooltip) {
            return undefined;
        }

        anchor.addEventListener('mouseenter', handleMouseEnter);
        anchor.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            anchor.removeEventListener('mouseenter', handleMouseEnter);
            anchor.removeEventListener('mouseleave', handleMouseLeave);

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [anchorRef, tooltipRef, timer]);

    const offsets = computeOffset();

    const { computedPosition, isVisible } = Popover.useComputePosition(
        placement as Placement,
        anchorRef,
        tooltipRef,
        isOpen,
        offsets,
    );

    const tooltipStyles: CSSProperties = useMemo(
        () => ({
            display: isVisible ? 'block' : 'none',
            position: 'fixed',
            transform: `translate3d(${computedPosition.x}px, ${computedPosition.y}px, 0)`,
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
