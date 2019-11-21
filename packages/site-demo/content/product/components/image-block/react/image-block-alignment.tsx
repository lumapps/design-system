import React from 'react';

import {
    Alignment,
    Chip,
    Grid,
    ImageBlock,
    Size,
    AspectRatio
} from '@lumx/react';

const App = ({ theme }) => (
    <ImageBlock
        align={Alignment.center}
        aspectRatio={AspectRatio.original}
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
        image="https://picsum.photos/320/240/?random"
    />
);

export default App;
