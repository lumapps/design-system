import React from 'react';

import { Alignment, AspectRatio, FlexBox, Orientation, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

const App = () => (
    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center} vAlign={Alignment.center} gap={Size.big}>
        <Thumbnail aspectRatio={AspectRatio.original} image="https://picsum.photos/320/240" size={Size.xl} />

        <Thumbnail
            aspectRatio={AspectRatio.vertical}
            image="https://picsum.photos/240/320"
            size={Size.xl}
            variant={ThumbnailVariant.rounded}
        />

        <Thumbnail aspectRatio={AspectRatio.square} image="https://picsum.photos/128" size={Size.l} />
    </FlexBox>
);

export default App;
