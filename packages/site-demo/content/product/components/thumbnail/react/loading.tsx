import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

export const App = ({ theme }: any) => (
    <Thumbnail
        isLoading
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
        alt="loading image"
        aspectRatio={AspectRatio.square}
        size={Size.xl}
        variant={ThumbnailVariant.rounded}
        theme={theme}
    />
);
