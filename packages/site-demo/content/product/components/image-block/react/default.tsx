import React from 'react';

import {
    ButtonEmphasis,
    Chip,
    Grid,
    IconButton,
    ImageBlock,
    Size,
    AspectRatio
} from '@lumx/react';
import { mdiPencil, mdiEye, mdiDelete } from '@lumx/icons';

const App = ({ theme }) => (
    <ImageBlock
        actions={
            <Grid>
                <div className="lumx-spacing-margin-right-regular">
                    <IconButton
                        color="dark"
                        emphasis={ButtonEmphasis.low}
                        hasBackground={true}
                        icon={mdiPencil}
                    />
                </div>

                <div className="lumx-spacing-margin-right-regular">
                    <IconButton
                        color="dark"
                        emphasis={ButtonEmphasis.low}
                        hasBackground={true}
                        icon={mdiEye}
                    />
                </div>

                <div>
                    <IconButton
                        color="dark"
                        emphasis={ButtonEmphasis.low}
                        hasBackground={true}
                        icon={mdiDelete}
                    />
                </div>
            </Grid>
        }
        aspectRatio={AspectRatio.horizontal}
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
