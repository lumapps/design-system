import { useMemo, useState } from 'react';

import { useFloating, autoUpdate } from '@floating-ui/react-dom';

import { IS_BROWSER } from '@lumx/react/constants';
import { Placement } from '@lumx/core/js/components/Popover/constants';
import {
    parseAutoPlacement,
    parseFitWidth,
    buildPopoverMiddleware,
    computeArrowStyles,
    getFloatingPlacement,
} from '@lumx/core/js/components/Popover/popoverStyle';
import { PopoverProps } from '@lumx/react/components/popover/Popover';

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

    const parsedPlacement = parseAutoPlacement(placement);
    const fitWidth = parseFitWidth(fitToAnchorWidth);
    const boundary = boundaryRef?.current ?? undefined;

    const middleware = useMemo(
        () =>
            buildPopoverMiddleware({
                offset,
                hasArrow,
                fitWidth,
                fitWithinViewportHeight,
                boundary,
                parsedPlacement,
                arrowElement,
            }),
        [offset, hasArrow, fitWidth, fitWithinViewportHeight, boundary, parsedPlacement, arrowElement],
    );

    const anchorElement = anchorRef.current;

    const {
        floatingStyles,
        placement: resolvedPlacement,
        isPositioned,
        middlewareData,
    } = useFloating({
        placement: getFloatingPlacement(parsedPlacement),
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
    const arrowStyles = useMemo(
        (): React.CSSProperties | undefined => computeArrowStyles(middlewareData.arrow),
        [middlewareData.arrow],
    );

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
