import React from 'react';

import { Alignment, Grid, Orientation, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

const App = () => (
    <Grid orientation={Orientation.horizontal} vAlign={Alignment.spaceAround}>
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.squared} />
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.rounded} />
    </Grid>
);

export default App;
