import { Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

export const App = () => (
    <>
        <Thumbnail image="/demo-assets/square1.jpg" alt="Squared" size={Size.xl} variant={ThumbnailVariant.squared} />
        <Thumbnail image="/demo-assets/square1.jpg" alt="Rounded" size={Size.xl} variant={ThumbnailVariant.rounded} />
    </>
);
