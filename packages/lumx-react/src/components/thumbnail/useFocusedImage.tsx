import { useEffect, useRef } from 'react';

import { AspectRatio, Size } from '..';
import { FocusedImage, LumHTMLImageElement } from './FocusedImage';
import { FocusPoint } from './FocusedImageOptions';

const useFocusedImage = (
    focus: FocusPoint,
    aspectRatio: AspectRatio,
    size: Size,
    debounceTime: number,
    updateOnWindowResize: boolean,
) => {
    const focusRef = useRef<FocusedImage | null>(null);

    useEffect(() => {
        focusRef.current?.setFocus(focus!);
    }, [focusRef.current, focus?.x, focus?.y, size]);

    return (f: HTMLImageElement) => {
        if (aspectRatio === AspectRatio.original) {
            focusRef.current = null;
        } else if (!focusRef.current) {
            focusRef.current = new FocusedImage(f as LumHTMLImageElement, {
                debounceTime,
                focus,
                updateOnWindowResize,
                updateOnContainerResize: updateOnWindowResize,
            });
        }
    };
};

export default useFocusedImage;
