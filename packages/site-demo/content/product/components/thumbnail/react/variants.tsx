import { Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Thumbnail image="/demo-assets/square1.jpg" size={Size.xl} variant={ThumbnailVariant.squared} />
        <Thumbnail image="/demo-assets/square1.jpg" size={Size.xl} variant={ThumbnailVariant.rounded} />
    </>
);
