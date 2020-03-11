import React from 'react';

import { Alignment, FlexBox, Orientation, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

const App = () => (
    <FlexBox orientation={Orientation.horizontal} vAlign={Alignment.spaceAround}>
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.squared} />
        <Thumbnail image="https://picsum.photos/150" size={Size.xl} variant={ThumbnailVariant.rounded} />
    </FlexBox>
);

export default App;
