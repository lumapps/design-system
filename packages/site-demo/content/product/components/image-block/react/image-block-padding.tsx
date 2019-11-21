import React from 'react';

import {
    Chip,
    Grid,
    ImageBlock,
    Size,
    AspectRatio
} from '@lumx/react';

const App = ({ theme }) => (
    <ImageBlock
        aspectRatio={AspectRatio.horizontal}
        captionStyle={{ padding: 32 }}
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
