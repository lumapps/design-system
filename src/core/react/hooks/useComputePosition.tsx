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
    staysOpenOnHover?: boolean,
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
 * @param [offset] Offset between the anchor and the popover.
 * @param [staysOpenOnHover] Whether the popover has to be displayed when hovered.
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
    staysOpenOnHover: boolean = true,
    hasParentWidth?: boolean,
    hasParentHeight?: boolean,
    // tslint:disable-next-line: no-any
    dependencies: any[] = [placement, anchorRef, popoverRef],
    callback?: (position: ElementPosition) => void,
): {
    computedPosition: ElementPosition;
    isVisible: boolean;
} => {
    const WINDOW_BOUNDING_OFFSET = 8;
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
    const [isMouseEntered, setIsMouseEntered] = useState<boolean>(false);
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
            isInViewPort(anchorRef.current.getBoundingClientRect(), 'full')
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
            anchorHeight: boundingAnchor.height,
            anchorWidth: boundingAnchor.width,
            height: boundingPopover.height,
            width: boundingPopover.width,
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
                maxHeight: window.innerHeight - (newPosition.y + bottomY) - WINDOW_BOUNDING_OFFSET,
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

            // Priority to bottom placement if possible, if not take the most available place;
            if (canBeBottom || boundingAnchor.top < window.innerHeight - boundingAnchor.bottom) {
                newPosition = bottomPosition;
            } else {
                const { x: topX, y: topY } = calculatePopoverPlacement(
                    MATCHING_PLACEMENT[placement].top,
                    boundingAnchor,
                    boundingPopover,
                );
                const y = Math.max(WINDOW_BOUNDING_OFFSET, newPosition.y + topY);
                const topPosition = {
                    ...newPosition,
                    maxHeight: boundingAnchor.top,
                    x: newPosition.x + topX,
                    y,
                };
                newPosition = topPosition;
            }
        } else {
            const { x, y } = calculatePopoverPlacement(placement, boundingAnchor, boundingPopover);
            const newY = Math.max(WINDOW_BOUNDING_OFFSET + newPosition.y, newPosition.y + y);
            const maxHeight =
                placement === Placement.TOP || placement === Placement.TOP_END || placement === Placement.TOP_START
                    ? boundingAnchor.top
                    : window.innerHeight - newY - WINDOW_BOUNDING_OFFSET;
            newPosition = {
                ...newPosition,
                maxHeight,
                x: newPosition.x + x,
                y: newY,
            };
        }

        newPosition.width = hasParentWidth ? boundingAnchor.width : 0;
        newPosition.height = hasParentHeight ? boundingAnchor.height : 0;

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

    return { computedPosition, isVisible: (isVisible && isAnchorInViewport) || (staysOpenOnHover && isMouseEntered) };
};

export { useComputePosition, useComputePositionType };
