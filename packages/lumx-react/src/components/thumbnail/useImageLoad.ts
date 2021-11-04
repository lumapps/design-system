import { RefObject, useEffect, useState } from 'react';

export type LoadingState = 'isLoading' | 'isLoaded' | 'hasError';

function getState(img: HTMLImageElement | null | undefined, event?: Event) {
    // Error event occurred or image loaded empty.
    if (event?.type === 'error' || (img?.complete && (img?.naturalWidth === 0 || img?.naturalHeight === 0))) {
        return 'hasError';
    }
    // Image is undefined or incomplete.
    if (!img || !img.complete) {
        return 'isLoading';
    }
    // Else loaded.
    return 'isLoaded';
}

export function useImageLoad(imageURL: string, imgRef?: RefObject<HTMLImageElement>): LoadingState {
    const [state, setState] = useState<LoadingState>(getState(imgRef?.current));

    // Update state when changing image URL or DOM reference.
    useEffect(() => {
        setState(getState(imgRef?.current));
    }, [imageURL, imgRef]);

    // Listen to `load` and `error` event on image
    useEffect(() => {
        const img = imgRef?.current;
        if (!img) return undefined;
        const update = (event?: Event) => setState(getState(img, event));
        img.addEventListener('load', update);
        img.addEventListener('error', update);
        return () => {
            img.removeEventListener('load', update);
            img.removeEventListener('error', update);
        };
    }, [imgRef, imgRef?.current?.src]);

    return state;
}
