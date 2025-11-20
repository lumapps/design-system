import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

export const App = ({ theme }: any) => (
    <Thumbnail
        image="brokenurl.jpg"
        alt="broken url image"
        aspectRatio={AspectRatio.square}
        size={Size.xl}
        variant={ThumbnailVariant.rounded}
        theme={theme}
    />
);
