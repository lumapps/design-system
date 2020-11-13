import { useEffect, useRef } from 'react';

import { AspectRatio, Size } from '@lumx/react/components';
import { FocusedImage, LumHTMLImageElement } from '@lumx/react/components/thumbnail/FocusedImage';
import { FocusPoint } from '@lumx/react/components/thumbnail/FocusedImageOptions';
import { ThumbnailStates } from '@lumx/react/components/thumbnail/Thumbnail';
import { ValueOf } from '../utils';

/**
 * Handle the focus point and the aspect ratio of an image.
 *
 * @param   focus                 Focus point value.
 * @param   aspectRatio           Aspect ratio of the image.
 * @param   size                  Size of the image.
 * @param   debounceTime          Debounce time when resizing.
 * @param   isFollowingWindowSize Update on resize.
 * @param   thumbnailState        State of the thumbnail.
 * @return                        Function to handle ref.
 */
const useFocusedImage = (
    focus: FocusPoint,
    aspectRatio: ValueOf<AspectRatio>,
    size: ValueOf<Size>,
    debounceTime: number,
    isFollowingWindowSize: boolean,
    thumbnailState: ValueOf<ThumbnailStates>,
) => {
    const focusRef = useRef<FocusedImage | null>(null);

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.setFocus(focus!);
        }
    }, [focusRef.current, focus?.x, focus?.y, size]);

    useEffect(() => {
        if (thumbnailState === 'hasError' || aspectRatio === AspectRatio.original) {
            focusRef.current = null;
        }
    }, [aspectRatio, thumbnailState]);

    return (f: HTMLImageElement) => {
        if (thumbnailState === 'hasError' || aspectRatio === AspectRatio.original) {
            focusRef.current = null;
        } else if (f && !focusRef.current) {
            focusRef.current = new FocusedImage(f as LumHTMLImageElement, {
                debounceTime,
                focus,
                updateOnWindowResize: isFollowingWindowSize,
                updateOnContainerResize: isFollowingWindowSize,
            });
        }
    };
};

export { useFocusedImage };
