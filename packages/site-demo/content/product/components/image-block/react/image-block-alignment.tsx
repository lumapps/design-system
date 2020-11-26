import { Alignment, AspectRatio, Chip, ChipGroup, ImageBlock, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
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
        image="/demo-assets/portrait1.jpg"
    />
);
