import { useMemo, useState } from 'react';

import {
    useFloating,
    offset as offsetMiddleware,
    flip,
    shift,
    size,
    arrow as arrowMiddleware,
    autoPlacement,
    autoUpdate,
    type Placement as FloatingPlacement,
    type Middleware,
} from '@floating-ui/react-dom';

import { IS_BROWSER } from '@lumx/react/constants';
import { PopoverProps } from '@lumx/react/components/popover/Popover';
import { ARROW_SIZE, FitAnchorWidth, Placement } from './constants';

function parseAutoPlacement(placement?: Placement) {
    if (placement === 'auto') return { isAuto: true };
    if (placement === 'auto-start') return { isAuto: true, autoAlignment: 'start' as const };
    if (placement === 'auto-end') return { isAuto: true, autoAlignment: 'end' as const };
    return { floatingPlacement: placement as FloatingPlacement, isAuto: false };
}

function parseFitWidth(fitToAnchorWidth?: PopoverProps['fitToAnchorWidth']) {
    if (!fitToAnchorWidth) return undefined;
    if (typeof fitToAnchorWidth === 'string') return fitToAnchorWidth;
    return FitAnchorWidth.MIN_WIDTH;
}

type Options = Pick<
    PopoverProps,
    | 'offset'
    | 'hasArrow'
    | 'fitToAnchorWidth'
    | 'fitWithinViewportHeight'
    | 'boundaryRef'
    | 'anchorRef'
    | 'placement'
    | 'style'
    | 'zIndex'
>;

interface Output {
    styles: { arrow?: React.CSSProperties; popover?: React.CSSProperties };
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
    placement,
    style,
    zIndex,
}: Options): Output {
    const [popperElement, setPopperElement] = useState<null | HTMLElement>(null);
    const [arrowElement, setArrowElement] = useState<null | HTMLElement>(null);

    const { floatingPlacement, isAuto, autoAlignment } = parseAutoPlacement(placement);
    const fitWidth = parseFitWidth(fitToAnchorWidth);

    const boundary = boundaryRef?.current ?? undefined;

    // Build middleware array (order matters: offset → flip/autoPlacement → shift → size → arrow)
    const middleware = useMemo(() => {
        const mw: Middleware[] = [];

        // Offset middleware
        const awayOffset = (offset?.away ?? 0) + (hasArrow ? ARROW_SIZE : 0);
        const alongOffset = offset?.along ?? 0;
        mw.push(offsetMiddleware({ mainAxis: awayOffset, crossAxis: alongOffset }));

        // Positioning middlewares
        if (isAuto) {
            mw.push(autoPlacement({ ...(boundary ? { boundary } : {}), alignment: autoAlignment }));
        } else {
            mw.push(flip(boundary ? { boundary } : {}));
            mw.push(shift(boundary ? { boundary } : {}));
        }

        // Size middleware
        if (fitWidth || fitWithinViewportHeight) {
            mw.push(
                size({
                    ...(boundary ? { boundary } : {}),
                    apply({ availableHeight, rects, elements }) {
                        if (fitWidth) {
                            Object.assign(elements.floating.style, { [fitWidth]: `${rects.reference.width}px` });
                        }
                        if (fitWithinViewportHeight) {
                            // eslint-disable-next-line no-param-reassign
                            elements.floating.style.maxHeight = `${Math.max(0, availableHeight - ARROW_SIZE)}px`;
                        }
                    },
                }),
            );
        }

        // Arrow middleware
        if (hasArrow && arrowElement) {
            mw.push(arrowMiddleware({ element: arrowElement, padding: ARROW_SIZE / 2 }));
        }

        return mw;
    }, [
        offset?.away,
        offset?.along,
        hasArrow,
        isAuto,
        autoAlignment,
        boundary,
        fitWidth,
        fitWithinViewportHeight,
        arrowElement,
    ]);

    const anchorElement = anchorRef.current;

    const {
        floatingStyles,
        placement: resolvedPlacement,
        isPositioned,
        middlewareData,
    } = useFloating({
        placement: floatingPlacement,
        // Disable autoUpdate and element refs in non-browser environments (e.g. jsdom) to avoid
        // flushSync act() warnings from @floating-ui/react-dom (positioning is not meaningful in jsdom anyway).
        ...(IS_BROWSER
            ? {
                  whileElementsMounted: autoUpdate,
                  elements: { reference: anchorElement, floating: popperElement },
              }
            : {}),
        middleware,
    });

    const position = resolvedPlacement ?? placement;

    // Compute arrow styles from middleware data
    const arrowStyles = useMemo((): React.CSSProperties | undefined => {
        const arrowData = middlewareData.arrow;
        if (!arrowData) return undefined;
        return {
            left: arrowData.x != null ? `${arrowData.x}px` : '',
            top: arrowData.y != null ? `${arrowData.y}px` : '',
        };
    }, [middlewareData.arrow]);

    // Merge floating styles with user-provided styles and zIndex
    const popoverStyle = useMemo((): React.CSSProperties => {
        return { ...style, ...floatingStyles, zIndex };
    }, [style, floatingStyles, zIndex]);

    return {
        styles: { arrow: arrowStyles, popover: popoverStyle },
        isPositioned,
        position: position as Placement,
        setArrowElement,
        setPopperElement,
        popperElement,
    };
}
