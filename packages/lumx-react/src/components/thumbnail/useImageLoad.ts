import { useEffect, useState } from 'react';
import { getImageLoadingState } from '@lumx/core/js/components/Thumbnail';
import { type LoadingState } from '@lumx/core/js/components/Thumbnail/types';

export function useImageLoad(imageURL: string, imgRef?: HTMLImageElement): LoadingState {
    const [state, setState] = useState<LoadingState>(getImageLoadingState(imgRef));

    // Update state when changing image URL or DOM reference.
    useEffect(() => {
        setState(getImageLoadingState(imgRef));
    }, [imageURL, imgRef]);

    // Listen to `load` and `error` event on image
    useEffect(() => {
        const img = imgRef;
        if (!img) return undefined;
        const update = (event?: Event) => setState(getImageLoadingState(img, event));
        img.addEventListener('load', update);
        img.addEventListener('error', update);
        return () => {
            img.removeEventListener('load', update);
            img.removeEventListener('error', update);
        };
    }, [imgRef, imgRef?.src]);

    return state;
}
