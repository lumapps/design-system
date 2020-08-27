import { useCallback, useEffect, useRef } from 'react';

import { AspectRatio, Size } from '@lumx/react/components';
import { FocusedImage, LumHTMLImageElement } from '@lumx/react/components/thumbnail/FocusedImage';
import { FocusPoint } from '@lumx/react/components/thumbnail/FocusedImageOptions';

/**
 * Handle the focus point and the aspect ratio of an image.
 *
 * @param   focus                 Focus point value.
 * @param   aspectRatio           Aspect ratio of the image.
 * @param   size                  Size of the image.
 * @param   debounceTime          Debounce time when resizing.
 * @param   isFollowingWindowSize Update on resize.
 * @return                        Function to handle ref.
 */
const useFocusedImage = (
    focus: FocusPoint,
    aspectRatio: AspectRatio,
    size: Size,
    debounceTime: number,
    isFollowingWindowSize: boolean,
) => {
    const focusRef = useRef<FocusedImage | null>(null);

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.setFocus(focus!);
        }
    }, [focusRef.current, focus?.x, focus?.y, size]);

    useEffect(() => {
        if (aspectRatio === AspectRatio.original) {
            focusRef.current = null;
        }
    }, [aspectRatio]);

    return useCallback(
        (f: HTMLImageElement) => {
            if (aspectRatio === AspectRatio.original) {
                focusRef.current = null;
            } else if (!focusRef.current) {
                focusRef.current = new FocusedImage(f as LumHTMLImageElement, {
                    debounceTime,
                    focus,
                    updateOnWindowResize: isFollowingWindowSize,
                    updateOnContainerResize: isFollowingWindowSize,
                });
            }
        },
        [focusRef.current, aspectRatio],
    );
};

export { useFocusedImage };
