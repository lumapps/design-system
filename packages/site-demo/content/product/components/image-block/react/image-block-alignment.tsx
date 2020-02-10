import React from 'react';

import { Alignment, AspectRatio, Chip, ChipGroup, ImageBlock, Size } from '@lumx/react';

const App = ({ theme }: any) => (
    <ImageBlock
        align={Alignment.center}
        aspectRatio={AspectRatio.original}
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        tags={
            <ChipGroup align={Alignment.center}>
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
        image="https://picsum.photos/320/240/?random"
    />
);

export default App;
