import React from 'react';

import { Alignment, AspectRatio, Grid, Orientation, Thumbnail } from '@lumx/react';

const App = () => (
    <Grid orientation={Orientation.horizontal} vAlign={Alignment.spaceBetween}>
        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.square} image="https://picsum.photos/150" />
        </div>

        <Thumbnail aspectRatio={AspectRatio.original} image="https://picsum.photos/150/80/" />

        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.vertical} image="https://picsum.photos/150/150" />
        </div>

        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.horizontal} image="https://picsum.photos/150/150" />
        </div>
    </Grid>
);

export default App;
