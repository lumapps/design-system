import React, { useEffect, useMemo, useState } from 'react';
import memoize from 'lodash/memoize';
import { detectOverflow } from '@popperjs/core';

import { DOCUMENT, WINDOW } from '@lumx/react/constants';
import { PopoverProps } from '@lumx/react/components/popover/Popover';
import { usePopper } from '@lumx/react/hooks/usePopper';
import { ARROW_SIZE, FitAnchorWidth, Placement } from './constants';

/**
 * Popper js modifier to fit popover min width to the anchor width.
 */
const sameWidth = memoize((anchorWidthOption: FitAnchorWidth) => ({
    name: 'sameWidth',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn({ state }: any) {
        // eslint-disable-next-line no-param-reassign
        state.styles.popper[anchorWidthOption] = `${state.rects.reference.width}px`;
    },
    effect({ state }: any) {
        // eslint-disable-next-line no-param-reassign
        state.elements.popper.style[anchorWidthOption] = `${state.elements.reference.offsetWidth}px`;
    },
}));

/**
 * Popper js modifier to compute max size of the popover.
 */
const maxSize = {
    name: 'maxSize',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['offset', 'preventOverflow', 'flip'],
    fn({ state, name, options }: any) {
        const overflow = detectOverflow(state, options);

        const { y = 0, x = 0 } = state.modifiersData.preventOverflow;
        const { width, height } = state.rects.popper;

        const [basePlacement] = state.placement.split('-');

        const widthProp = basePlacement === 'left' ? 'left' : 'right';
        const heightProp = basePlacement === 'top' ? 'top' : 'bottom';
        // eslint-disable-next-line no-param-reassign
        state.modifiersData[name] = {
            width: width - overflow[widthProp] - x,
            height: height - overflow[heightProp] - y,
        };
    },
};

/**
 * Popper js modifier to apply the max height.
 */
const applyMaxHeight = {
    name: 'applyMaxHeight',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['maxSize'],
    fn({ state }: any) {
        const { height } = state.modifiersData.maxSize;
        // eslint-disable-next-line no-param-reassign
        state.elements.popper.style.maxHeight = `${height - ARROW_SIZE}px`;
    },
};

type Options = Pick<
    PopoverProps,
    | 'offset'
    | 'hasArrow'
    | 'fitToAnchorWidth'
    | 'fitWithinViewportHeight'
    | 'boundaryRef'
    | 'anchorRef'
    | 'children'
    | 'placement'
    | 'style'
    | 'zIndex'
>;

interface Output {
    styles: { arrow?: React.CSSProperties; popover?: React.CSSProperties };
    attributes: any;
    isPositioned: boolean;
    position?: Placement;
    setArrowElement?: React.Ref<HTMLDivElement>;
    setPopperElement?: React.Ref<HTMLDivElement>;
    popperElement: HTMLElement | null;
}

export function usePopoverStyle({
    offset,
    hasArrow,
    fitToAnchorWidth,
    fitWithinViewportHeight,
    boundaryRef,
    anchorRef,
    children,
    placement,
    style,
    zIndex,
}: Options): Output {
    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);

    const [arrowElement, setArrowElement] = useState<null | HTMLElement>(null);

    const actualOffset: [number, number] = [offset?.along ?? 0, (offset?.away ?? 0) + (hasArrow ? ARROW_SIZE : 0)];
    const modifiers: any = [
        {
            name: 'offset',
            options: { offset: actualOffset },
        },
    ];
    if (hasArrow && arrowElement) {
        modifiers.push({
            name: 'arrow',
            options: {
                element: arrowElement,
                padding: ARROW_SIZE / 2,
            },
        });
    }
    if (fitToAnchorWidth) {
        const fitWidth = typeof fitToAnchorWidth === 'string' ? fitToAnchorWidth : FitAnchorWidth.MIN_WIDTH;
        modifiers.push(sameWidth(fitWidth));
    }
    if (fitWithinViewportHeight) {
        modifiers.push({ ...maxSize, options: { boundary: boundaryRef?.current } }, applyMaxHeight);
    }
    if (boundaryRef) {
        modifiers.push(
            { name: 'flip', options: { boundary: boundaryRef.current } },
            { name: 'preventOverflow', options: { boundary: boundaryRef.current } },
        );
    }

    const { styles, attributes, state, update } = usePopper(anchorRef.current, popperElement, { placement, modifiers });
    useEffect(() => {
        update?.();
    }, [children, update]);

    const position = state?.placement ?? placement;

    const popoverStyle = useMemo(() => {
        const newStyles = { ...style, ...styles.popper, zIndex };

        if (fitWithinViewportHeight && !newStyles.maxHeight) {
            newStyles.maxHeight = WINDOW?.innerHeight || DOCUMENT?.documentElement.clientHeight;
        }

        return newStyles;
    }, [style, styles.popper, zIndex, fitWithinViewportHeight]);
    return {
        styles: { arrow: styles.arrow, popover: popoverStyle },
        attributes,
        isPositioned: (state?.rects?.popper?.y ?? -1) >= 0,
        position,
        setArrowElement,
        setPopperElement,
        popperElement,
    };
}
