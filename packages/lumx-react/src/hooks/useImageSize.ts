import React from 'react';
import { RectSize } from '@lumx/react/utils/type';

/** Get natural image size after load. */
export function useImageSize(imgRef: React.RefObject<HTMLImageElement>, getInitialSize?: () => RectSize | null) {
    const [imageSize, setImageSize] = React.useState<null | RectSize>(getInitialSize || null);
    React.useEffect(() => {
        const { current: img } = imgRef;
        if (!img) {
            return undefined;
        }
        const onLoad = () => setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        img.addEventListener('load', onLoad);
        return () => img.removeEventListener('load', onLoad);
    }, [imgRef]);
    return imageSize;
}
