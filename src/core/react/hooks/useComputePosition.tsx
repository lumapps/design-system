import { useEffect, useState } from 'react';

import { ElementPosition, Offset, Placement } from 'LumX/components/popover/react/Popover';

import { calculatePopoverPlacement } from '../utils/calculatePopoverPlacement';
import { isInViewPort } from '../utils/isInViewPort';

type useComputePositionType = (
    placement: Placement,
    anchorRef: React.RefObject<HTMLElement>,
    popoverRef: React.RefObject<HTMLDivElement>,
    isVisible: boolean,
    offset?: Offset,
    hasParentWidth?: boolean,
    hasParentHeight?: boolean,
    // tslint:disable-next-line: no-any
    dependencies?: any[],
    callback?: (position: ElementPosition) => void,
) => {
    computedPosition: ElementPosition;
    isVisible: boolean;
};

// tslint:disable-next-line: valid-jsdoc
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
const useComputePosition: useComputePositionType = (
    placement: Placement,
    anchorRef: React.RefObject<HTMLElement>,
    popoverRef: React.RefObject<HTMLDivElement>,
    isVisible: boolean,
    offset: Offset = { horizontal: 0, vertical: 0 },
    hasParentWidth?: boolean,
    hasParentHeight?: boolean,
    // tslint:disable-next-line: no-any
    dependencies: any[] = [placement, anchorRef, popoverRef],
    callback?: (position: ElementPosition) => void,
): {
    computedPosition: ElementPosition;
    isVisible: boolean;
} => {
    const MATCHING_PLACEMENT = Placement && {
        [Placement.AUTO]: {
            bottom: Placement.BOTTOM,
            top: Placement.TOP,
        },
        [Placement.AUTO_START]: {
            bottom: Placement.BOTTOM_START,
            top: Placement.TOP_START,
        },
        [Placement.AUTO_END]: {
            bottom: Placement.BOTTOM_END,
            top: Placement.TOP_END,
        },
    };
    // Handle mouse over the popover to prevent it from closing from outside (infinite mouse event bug).
    const [isMouseEntered, setIsMouseEntered] = useState(false);
    const [isAnchorInViewport, setIsAnchorInViewport] = useState(false);
    const defaultPosition = {
        x: 0,
        y: 0,
    };

    const [computedPosition, setComputedPosition] = useState(defaultPosition);

    const computePosition = (): void => {
        const newIsAnchorInViewPort = !!(
            anchorRef &&
            anchorRef.current &&
            isInViewPort(anchorRef.current.getBoundingClientRect(), 'partial')
        );
        setIsAnchorInViewport(newIsAnchorInViewPort);

        if (!anchorRef || !anchorRef.current || !popoverRef || !popoverRef.current || !newIsAnchorInViewPort) {
            setComputedPosition(defaultPosition);
            return;
        }

        const boundingAnchor = anchorRef.current.getBoundingClientRect();
        const boundingPopover = popoverRef.current.getBoundingClientRect();
        const { horizontal = 0, vertical = 0 } = offset;
        let newPosition: ElementPosition = {
            height: hasParentHeight ? boundingAnchor.height : boundingPopover.height,
            width: hasParentWidth ? boundingAnchor.width : boundingPopover.width,
            x: horizontal,
            y: vertical,
        };

        if (placement === Placement.AUTO || placement === Placement.AUTO_END || placement === Placement.AUTO_START) {
            // Try BOTTOM placement.

            const { x: bottomX, y: bottomY } = calculatePopoverPlacement(
                MATCHING_PLACEMENT[placement].bottom,
                boundingAnchor,
                boundingPopover,
            );

            const bottomPosition = {
                ...newPosition,
                bottom: newPosition.y + bottomY + Number(newPosition.height),
                left: newPosition.x + bottomX,
                right: newPosition.x + bottomX + Number(newPosition.width),
                top: newPosition.y + bottomY,
                x: newPosition.x + bottomX,
                y: newPosition.y + bottomY,
            };

            const canBeBottom = isInViewPort(
                {
                    ...boundingPopover,
                    ...bottomPosition,
                },
                'full',
            );

            if (canBeBottom) {
                newPosition = bottomPosition;
            } else {
                const { x: topX, y: topY } = calculatePopoverPlacement(
                    MATCHING_PLACEMENT[placement].top,
                    boundingAnchor,
                    boundingPopover,
                );
                const topPosition = { ...newPosition, x: newPosition.x + topX, y: newPosition.y + topY };
                newPosition = topPosition;
            }
        } else {
            const { x, y } = calculatePopoverPlacement(placement, boundingAnchor, boundingPopover);

            newPosition = { ...newPosition, x: newPosition.x + x, y: newPosition.y + y };
        }
        if (callback) {
            callback(newPosition);
        }

        setComputedPosition(newPosition);
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
        if (popoverRef && popoverRef.current && (isVisible || isMouseEntered)) {
            popoverRef.current!.addEventListener('mouseenter', handleMouseEnter);
            popoverRef.current!.addEventListener('mouseleave', handleMouseLeave);
        }

        return (): void => {
            if (popoverRef && popoverRef.current) {
                popoverRef.current!.removeEventListener('mouseenter', handleMouseEnter);
                popoverRef.current!.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [isAnchorInViewport, isVisible, isMouseEntered, handleMouseEnter, handleMouseLeave, popoverRef]);

    useEffect(() => {
        window.addEventListener('scroll', computePosition, true);
        window.addEventListener('resize', computePosition);

        computePosition();

        return (): void => {
            window.removeEventListener('scroll', computePosition, true);
            window.removeEventListener('resize', computePosition);
        };
    }, [...dependencies, isAnchorInViewport, isVisible]);

    return { computedPosition, isVisible: (isVisible && isAnchorInViewport) || isMouseEntered };
};

export { useComputePosition, useComputePositionType };
