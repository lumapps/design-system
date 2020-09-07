import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Thumbnail aspectRatio={AspectRatio.original} image="/demo-assets/landscape3.jpg" size={Size.xl} />

        <Thumbnail
            aspectRatio={AspectRatio.vertical}
            image="/demo-assets/portrait3.jpg"
            size={Size.xl}
            variant={ThumbnailVariant.rounded}
        />

        <Thumbnail aspectRatio={AspectRatio.square} image="/demo-assets/square1.jpg" size={Size.l} />
    </>
);
