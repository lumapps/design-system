import { useEffect, useState } from 'react';

import { ElementPosition, Offsets, Placement } from 'LumX/components/popover/react/Popover';

import { calculatePopoverPlacement } from '../utils/calculatePopoverPlacement';
import { isInViewPort } from '../utils/isInViewPort';

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
const useComputePosition: (
    callback: (position: ElementPosition) => void,
    placement: Placement,
    anchorRef: React.RefObject<HTMLElement>,
    popoverRef: React.RefObject<HTMLDivElement>,
    offset?: Offsets,
    hasParentWidth?: boolean,
    hasParentHeight?: boolean,
    // Tslint:disable-next-line: no-any.
    dependencies?: any[],
) => ElementPosition = (
    callback: (position: ElementPosition) => void,
    placement: Placement,
    anchorRef: React.RefObject<HTMLElement>,
    popoverRef: React.RefObject<HTMLDivElement>,
    offset: Offsets = { horizontal: 0, vertical: 0 },
    hasParentWidth?: boolean,
    hasParentHeight?: boolean,
    // Tslint:disable-next-line: no-any.
    dependencies: any[] = [placement, anchorRef, popoverRef],
): void => {
    const computePosition = (): void => {
        if (!anchorRef || !anchorRef.current || !popoverRef || !popoverRef.current) {
            return;
        }

        const boundingAnchor = anchorRef.current!.getBoundingClientRect();
        const boundingPopover = popoverRef.current!.getBoundingClientRect();
        const { horizontal = 0, vertical = 0 } = offset;
        const newPosition: ElementPosition = {
            height: hasParentHeight ? boundingAnchor.height : boundingPopover.height,
            width: hasParentWidth ? boundingAnchor.width : boundingPopover.width,
            x: horizontal,
            y: vertical,
        };

        if (placement === Placement.AUTO || placement === Placement.AUTO_END || placement === Placement.AUTO_START) {
            // Try TOP placement.
            const { x, y } = calculatePopoverPlacement(Placement.TOP, boundingAnchor, boundingPopover);

            console.log(
                isInViewPort(
                    {
                        width: newPosition.width!,
                        height: newPosition.height!,
                        x: newPosition.x + x,
                        y: newPosition.y + y,
                    },
                    'full',
                ),
            );
        } else {
            const { x, y } = calculatePopoverPlacement(placement, boundingAnchor, boundingPopover);

            callback({ ...newPosition, x: newPosition.x + x, y: newPosition.y + y });
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', computePosition, true);
        window.addEventListener('resize', computePosition);

        computePosition();

        return (): void => {
            window.removeEventListener('scroll', computePosition, true);
            window.removeEventListener('resize', computePosition);
        };
    }, [computePosition]);
};

export { useComputePosition };
