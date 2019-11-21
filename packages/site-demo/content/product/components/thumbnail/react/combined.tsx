import React from 'react';

import { Size, Thumbnail, AspectRatio, ThumbnailVariant } from '@lumx/react';

const App = ({ theme }) => (
    <>
        <Thumbnail
            aspectRatio={AspectRatio.original}
            image="https://picsum.photos/320/240"
            size={Size.l}
            theme={theme}
            variant={ThumbnailVariant.rounded}
        />
        <Thumbnail
            aspectRatio={AspectRatio.vertical}
            image="https://picsum.photos/240/320"
            size={Size.m}
            theme={theme}
            variant={ThumbnailVariant.rounded}
        />
        <Thumbnail
            aspectRatio={AspectRatio.square}
            image="https://picsum.photos/128"
            size={Size.xl}
            theme={theme}
            variant={ThumbnailVariant.rounded}
        />
    </>
);

export default App;
