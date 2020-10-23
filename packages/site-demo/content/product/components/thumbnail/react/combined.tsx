import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Thumbnail aspectRatio={AspectRatio.original} image="https://picsum.photos/320/240" size={Size.xl} />

        <Thumbnail
            aspectRatio={AspectRatio.vertical}
            image="https://picsum.photos/240/320"
            size={Size.xl}
            variant={ThumbnailVariant.rounded}
        />

        <Thumbnail aspectRatio={AspectRatio.square} image="https://picsum.photos/128" size={Size.l} />
    </>
);
