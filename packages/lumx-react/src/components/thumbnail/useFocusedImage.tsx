import { useCallback, useEffect, useRef } from 'react';

import { FocusedImage, ILumHTMLImageElement } from './FocusedImage';
import { IFocusPoint } from './IFocusedImageOptions';

const useFocusedImage = (focus: IFocusPoint) => {
    const focusRef = useRef<FocusedImage>();

    useEffect(() => {
        focusRef.current?.setFocus(focus!);
    }, [focusRef.current, focus?.x, focus?.y]);

    return useCallback((f: HTMLImageElement) => {
        if (!focusRef.current) {
            focusRef.current = new FocusedImage(f as ILumHTMLImageElement, {
                debounceTime: 17,
                focus,
                updateOnWindowResize: true,
            });
        }
    }, []);
};

export default useFocusedImage;
