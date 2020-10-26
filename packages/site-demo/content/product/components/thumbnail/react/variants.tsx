import { Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.squared} />
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.rounded} />
    </>
);
