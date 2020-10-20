import React from 'react';

import { Alignment, AspectRatio, FlexBox, Orientation, Size, Thumbnail } from '@lumx/react';

const App = () => (
    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center} vAlign={Alignment.center} gap={Size.big}>
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
    </FlexBox>
);

export default App;
