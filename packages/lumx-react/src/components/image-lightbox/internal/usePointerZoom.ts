import React from 'react';
import type { Point } from '@lumx/react/utils/type';
import type { useAnimateScroll } from './useAnimateScroll';

/**
 * Listen to mouse wheel + ctrl and multi-pointer pinch to zoom
 */
export function usePointerZoom(
    scrollAreaRef: React.RefObject<HTMLDivElement>,
    onScaleChange: ((value: number) => void) | undefined,
    animateScroll: ReturnType<typeof useAnimateScroll>,
) {
    const [isPointerZooming, setPointerZooming] = React.useState(false);
    React.useEffect(() => {
        const scrollArea = scrollAreaRef.current as HTMLDivElement;
        if (!scrollArea || !onScaleChange) {
            return undefined;
        }

        let animationFrame: number | null;
        let zoomStateTimeoutId: ReturnType<typeof setTimeout> | null;

        function updateScaleOnNextFrame(newScale: number, mousePosition: Point): void {
            // Cancel previously scheduled frame
            if (animationFrame) cancelAnimationFrame(animationFrame);

            // Cancel previously scheduled zoom state change
            if (zoomStateTimeoutId) clearTimeout(zoomStateTimeoutId);

            function nextFrame() {
                setPointerZooming(true);
                onScaleChange?.(newScale);

                animationFrame = null;
                // Wait a bit before indicating the pointer zooming is finished
                zoomStateTimeoutId = setTimeout(() => setPointerZooming(false), 100);
            }
            animationFrame = requestAnimationFrame(nextFrame);

            // Animate scroll in parallel (centering on the current mouse position)
            animateScroll(mousePosition, {
                width: scrollArea.scrollWidth,
                height: scrollArea.scrollHeight,
            });
        }

        function onWheel(event: WheelEvent) {
            if (!event.ctrlKey) {
                return;
            }
            event.preventDefault();
            const newScale = Math.exp(-event.deltaY / 50);

            // Update scale on next frame (focused on the mouse position)
            updateScaleOnNextFrame(newScale, {
                x: event.pageX,
                y: event.pageY,
            });
        }

        const activePointers: Record<PointerEvent['pointerId'], PointerEvent> = {};
        let prevDistance: number | null = null;
        let previousCenterPoint: Point | null = null;

        function onPointerDown(event: PointerEvent) {
            activePointers[event.pointerId] = event;
        }
        function onPointerMove(event: PointerEvent) {
            // Update pointer in cache
            if (activePointers[event.pointerId]) {
                activePointers[event.pointerId] = event;
            }

            const pointers = Object.values(activePointers);

            // Make sure we run computation on one of the pointer in the group
            if (pointers[0].pointerId !== event.pointerId) {
                return;
            }

            // Centered point between all pointers
            const centerPoint: Point = {
                x: pointers.reduce((x, { clientX }) => x + clientX, 0) / pointers.length,
                y: pointers.reduce((y, { clientY }) => y + clientY, 0) / pointers.length,
            };

            // Movement of the center point
            const deltaCenterPoint = previousCenterPoint && {
                left: previousCenterPoint.x - centerPoint.x,
                top: previousCenterPoint.y - centerPoint.y,
            };

            // Pan X & Y
            if (deltaCenterPoint) {
                // Apply movement of the center point to the scroll
                scrollArea.scrollBy({
                    top: deltaCenterPoint.top / 2,
                    left: deltaCenterPoint.left / 2,
                });
            }

            // Pinch to zoom
            if (pointers.length === 2) {
                const [pointer1, pointer2] = pointers;
                const distance = Math.hypot(pointer2.clientX - pointer1.clientX, pointer2.clientY - pointer1.clientY);

                if (prevDistance && deltaCenterPoint) {
                    const delta = prevDistance - distance;
                    const absDelta = Math.abs(delta);

                    // Zoom only if we are "pinching" more than we are moving the pointers
                    if (absDelta > Math.abs(deltaCenterPoint.left) && absDelta > Math.abs(deltaCenterPoint.top)) {
                        // Update scale on next frame (focused on the center point between the two pointers)
                        const newScale = Math.exp(-delta / 100);
                        updateScaleOnNextFrame(newScale, centerPoint);
                    }
                }

                prevDistance = distance;
            }

            previousCenterPoint = centerPoint;
        }
        function onPointerUp(event: PointerEvent) {
            prevDistance = null;
            previousCenterPoint = null;
            delete activePointers[event.pointerId];
        }

        scrollArea.addEventListener('wheel', onWheel, { passive: false });
        const isMultiTouch = navigator.maxTouchPoints >= 2;
        if (isMultiTouch) {
            scrollArea.addEventListener('pointerdown', onPointerDown);
            scrollArea.addEventListener('pointermove', onPointerMove);
            scrollArea.addEventListener('pointerup', onPointerUp);
        }
        return () => {
            scrollArea.removeEventListener('wheel', onWheel);
            if (isMultiTouch) {
                scrollArea.removeEventListener('pointerdown', onPointerDown);
                scrollArea.removeEventListener('pointermove', onPointerMove);
                scrollArea.removeEventListener('pointerup', onPointerUp);
            }
        };
    }, [animateScroll, onScaleChange, scrollAreaRef]);

    return isPointerZooming;
}
