import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

export const App = () => (
    <>
        <Thumbnail
            image="/demo-assets/landscape3.jpg"
            alt="Landscape"
            aspectRatio={AspectRatio.original}
            size={Size.xl}
        />

        <Thumbnail
            image="/demo-assets/portrait3.jpg"
            alt="Portrait"
            aspectRatio={AspectRatio.vertical}
            size={Size.xl}
            variant={ThumbnailVariant.rounded}
        />

        <Thumbnail alt="Square" image="/demo-assets/square1.jpg" aspectRatio={AspectRatio.square} size={Size.l} />
    </>
);
