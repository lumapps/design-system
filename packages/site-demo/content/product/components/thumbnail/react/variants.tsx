import React from 'react';

import { Alignment, FlexBox, Orientation, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

const App = () => (
    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center} vAlign={Alignment.center} gap={Size.big}>
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.squared} />
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.rounded} />
    </FlexBox>
);

export default App;
