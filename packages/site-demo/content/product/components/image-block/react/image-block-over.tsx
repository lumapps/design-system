import React from 'react';

import { AspectRatio, Chip, ChipGroup, ImageBlock, ImageBlockCaptionPosition, Size } from '@lumx/react';

const App = ({ theme }) => (
    <ImageBlock
        aspectRatio={AspectRatio.horizontal}
        captionPosition={ImageBlockCaptionPosition.over}
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
