import React from 'react';

import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { AspectRatio, Chip, ChipGroup, Emphasis, Grid, IconButton, ImageBlock, Size } from '@lumx/react';

const App = ({ theme }: any) => (
    <ImageBlock
        actions={
            <Grid>
                <div className="lumx-spacing-margin-right-regular">
                    <IconButton color="dark" emphasis={Emphasis.low} hasBackground={true} icon={mdiPencil} />
                </div>

                <div className="lumx-spacing-margin-right-regular">
                    <IconButton color="dark" emphasis={Emphasis.low} hasBackground={true} icon={mdiEye} />
                </div>

                <div>
                    <IconButton color="dark" emphasis={Emphasis.low} hasBackground={true} icon={mdiDelete} />
                </div>
            </Grid>
        }
        aspectRatio={AspectRatio.horizontal}
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        tags={
            <ChipGroup>
                <Chip size={Size.s} theme={theme}>
                    Tag 1
                </Chip>

                <Chip size={Size.s} theme={theme}>
                    Tag 2
                </Chip>
            </ChipGroup>
        }
        theme={theme}
        title="Lorem ipsum"
        image="https://picsum.photos/800/600/?random"
    />
);

export default App;
