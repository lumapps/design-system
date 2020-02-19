import React from 'react';

import { Alignment, AspectRatio, Chip, ChipGroup, ImageBlock, Size } from '@lumx/react';
import { boolean, number, select, text } from '@storybook/addon-knobs';

export default { title: 'Image Block' };

const numberKnobOptions = {
    max: 1,
    min: -1,
    range: true,
    step: 0.1,
};

export const defaultImageBlock = ({ theme }: any) => {
    const align = select<Alignment>('Alignment', Alignment, Alignment.center, 'Image block');
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, 'Image block');
    const title = text('Title', 'Hello world', 'Image block');
    const description = text('Description', 'My awesome description', 'Image block');
    const isDisplayedTags = boolean('Display tags', true, 'Image block');
    const tags = (
        <ChipGroup align={Alignment.left}>
            <Chip size={Size.s} theme={theme}>
                Tag 1
            </Chip>

            <Chip size={Size.s} theme={theme}>
                Tag 2
            </Chip>
        </ChipGroup>
    );
    const imageUrl = text('Url image', 'https://i.picsum.photos/id/1001/2400/1400.jpg', 'Image block');
    const focusPoint = {
        x: number('Focus X', 1, numberKnobOptions, 'Image block'),
        y: number('Focus Y', 0, numberKnobOptions, 'Image block'),
    };
    const size = select(
        'Size',
        {
            None: undefined,
            XL: Size.xl,
            XXL: Size.xxl,
        },
        Size.xxl,
        'Image block',
    );

    return (
        <ImageBlock
            align={align}
            aspectRatio={aspectRatio}
            description={description}
            focusPoint={focusPoint}
            image={imageUrl}
            size={size}
            tags={isDisplayedTags && tags}
            title={title}
            theme={theme}
        />
    );
};
