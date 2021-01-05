import { RefObject, useCallback, useEffect, useState } from 'react';

export type LoadingState = 'isLoading' | 'isLoaded' | 'hasError';

export function useImageLoad(imgRef?: RefObject<HTMLImageElement>): LoadingState {
    const [state, setState] = useState<LoadingState>('isLoading');

    const update = useCallback(
        (event?: any) => {
            const img = imgRef?.current;
            if (!img || !img.complete) {
                setState('isLoading');
                return;
            }

            if (event?.type === 'error' || (img.complete && img?.naturalWidth === 0)) {
                setState('hasError');
                return;
            }

            setState('isLoaded');
        },
        [imgRef],
    );

    useEffect(() => {
        const img = imgRef?.current;
        if (!img) return undefined;

        update();
        img.addEventListener('load', update);
        img.addEventListener('error', update);
        return () => {
            img.removeEventListener('load', update);
            img.removeEventListener('error', update);
        };
    }, [update, imgRef, imgRef?.current?.src]);
    return state;
}
