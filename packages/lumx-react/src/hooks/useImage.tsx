import { useEffect, useState } from 'react';

interface ImageStates {
    isLoaded: boolean;
    hasError: boolean;
}

/**
 * Hook to preload an image and get states from it.
 *
 * @param  src Source of the image.
 *
 * @return States from the image.
 */
const useImage = (src: string): ImageStates => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
        setIsNew(true);
        setIsLoaded(false);
        setHasError(false);
    }, [src]);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setHasError(true);
        setIsNew(false);
    }, [src, isNew]);

    return { isLoaded, hasError };
};

export { useImage };
