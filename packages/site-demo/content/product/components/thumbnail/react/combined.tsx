import React from 'react';

import { Alignment, AspectRatio, Grid, Orientation, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

const App = () => (
    <Grid orientation={Orientation.horizontal} vAlign={Alignment.spaceAround}>
        <Thumbnail
            aspectRatio={AspectRatio.original}
            image="https://picsum.photos/320/240"
            size={Size.l}
            variant={ThumbnailVariant.rounded}
        />

        <Thumbnail
            aspectRatio={AspectRatio.vertical}
            image="https://picsum.photos/240/320"
            size={Size.m}
            variant={ThumbnailVariant.rounded}
        />

        <Thumbnail
            aspectRatio={AspectRatio.square}
            image="https://picsum.photos/128"
            size={Size.xl}
            variant={ThumbnailVariant.rounded}
        />
    </Grid>
);

export default App;
