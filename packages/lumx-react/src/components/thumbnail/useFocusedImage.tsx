import { useCallback, useEffect, useRef } from 'react';

import { AspectRatio, Size } from '..';
import { FocusedImage, LumHTMLImageElement } from './FocusedImage';
import { FocusPoint } from './FocusedImageOptions';

const useFocusedImage = (
    focus: FocusPoint,
    aspectRatio: AspectRatio,
    size: Size,
    debounceTime: number,
    isFollowingWindowSize: boolean,
    isLoaded: boolean,
) => {
    const focusRef = useRef<FocusedImage | null>(null);

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.setFocus(focus!);
        }
    }, [focusRef.current, focus?.x, focus?.y, size]);

    useEffect(() => {
        if (aspectRatio === AspectRatio.original || !isLoaded) {
            focusRef.current = null;
        }
    }, [aspectRatio, isLoaded]);

    return useCallback(
        (f: HTMLImageElement) => {
            if (aspectRatio === AspectRatio.original || !isLoaded) {
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
        [focusRef.current, aspectRatio, isLoaded],
    );
};

export default useFocusedImage;
