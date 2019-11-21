import React from 'react';

import {
    Chip,
    Grid,
    ImageBlock,
    ImageBlockCaptionPosition,
    Size,
    AspectRatio
} from '@lumx/react';

const App = ({ theme }) => (
    <ImageBlock
        aspectRatio={AspectRatio.horizontal}
        captionPosition={ImageBlockCaptionPosition.over}
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        tags={
            <Grid>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    size={Size.s}>
                    Tag 1
                </Chip>
                <Chip
                    className="lumx-spacing-margin-right-tiny"
                    size={Size.s}>
                    Tag 2
                </Chip>
            </Grid>
        }
        theme={theme}
        title="Lorem ipsum"
        image="https://picsum.photos/800/600/?random"
    />
);

export default App;
