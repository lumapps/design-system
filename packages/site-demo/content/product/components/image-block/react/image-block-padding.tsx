import React from 'react';

import { AspectRatio, Chip, ChipGroup, ImageBlock, Size } from '@lumx/react';

const App = () => (
    <div className="lumx-theme-background-dark-L5 lumx-spacing-padding-huge">
        <div className="lumx-theme-background-light-N">
            <ImageBlock
                aspectRatio={AspectRatio.horizontal}
                captionStyle={{ padding: 16 }}
                description="Lorem ipsum dolor sit amet, consectur adipiscing "
                tags={
                    <ChipGroup>
                        <Chip size={Size.s}>Tag 1</Chip>
                        <Chip size={Size.s}>Tag 2</Chip>
                    </ChipGroup>
                }
                title="Lorem ipsum"
                image="https://picsum.photos/800/600/?random"
            />
        </div>
    </div>
);

export default App;
