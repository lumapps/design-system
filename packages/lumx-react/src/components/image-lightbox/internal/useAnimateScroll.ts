import React from 'react';
import type { Point, RectSize } from '@lumx/react/utils/type';

/** Maintains the scroll position centered relative to the original scroll area's dimensions when the content scales. */
export function useAnimateScroll(scrollAreaRef: React.RefObject<HTMLDivElement>) {
    return React.useMemo(() => {
        let animationFrame: number | null = null;

        return function animate(centerPoint?: Point, initialScrollAreaSize?: RectSize) {
            const scrollArea = scrollAreaRef.current as HTMLDivElement;
            if (!scrollArea) {
                return;
            }

            // Cancel previously running animation
            if (animationFrame) cancelAnimationFrame(animationFrame);

            // Center on the given point or else on the scroll area visual center
            const clientHeightRatio = centerPoint?.y ? centerPoint.y / scrollArea.clientHeight : 0.5;
            const clientWidthRatio = centerPoint?.x ? centerPoint.x / scrollArea.clientWidth : 0.5;

            const initialScrollHeight = initialScrollAreaSize?.height || scrollArea.scrollHeight;
            const initialScrollWidth = initialScrollAreaSize?.width || scrollArea.scrollWidth;

            const heightCenter = scrollArea.scrollTop + scrollArea.clientHeight * clientHeightRatio;
            const heightRatio = heightCenter / initialScrollHeight;

            const widthCenter = scrollArea.scrollLeft + scrollArea.clientWidth * clientWidthRatio;
            const widthRatio = widthCenter / initialScrollWidth;

            let prevScrollHeight = 0;
            let prevScrollWidth = 0;

            function nextFrame() {
                const { scrollHeight, scrollWidth, clientHeight, clientWidth } = scrollArea;

                // Scroll area stopped expanding => stop animation
                if (scrollHeight === prevScrollHeight && scrollWidth === prevScrollWidth) {
                    animationFrame = null;
                    return;
                }

                // Compute next scroll position
                const top = heightRatio * scrollHeight - clientHeight * clientHeightRatio;
                const left = widthRatio * scrollWidth - clientWidth * clientWidthRatio;

                scrollArea.scrollTo({ top, left });
                prevScrollHeight = scrollHeight;
                prevScrollWidth = scrollWidth;
                animationFrame = requestAnimationFrame(nextFrame);
            }
            animationFrame = requestAnimationFrame(nextFrame);
        };
    }, [scrollAreaRef]);
}
