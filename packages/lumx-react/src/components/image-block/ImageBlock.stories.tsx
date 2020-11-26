import { LANDSCAPE_IMAGES, landscapeImageKnob } from '@lumx/react/stories/knobs';
import React from 'react';

import { Alignment, AspectRatio, Chip, ChipGroup, CrossOrigin, ImageBlock, Size } from '@lumx/react';
import { htmlDecode } from '@lumx/react/utils/htmlDecode';
import { boolean, number, select, text } from '@storybook/addon-knobs';

export default { title: 'LumX components/image-block/Image Block' };

const numberKnobOptions = {
    max: 1,
    min: -1,
    range: true,
    step: 0.1,
};

const corsOptions = {
    None: undefined,
    Anonymous: CrossOrigin.anonymous,
    UseCredentials: CrossOrigin.useCredentials,
};

const groupId = 'Image block';

export const defaultImageBlock = ({ theme }: any) => {
    const align = select<Alignment>('Alignment', Alignment, Alignment.center, groupId);
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, groupId);
    const title = text('Title', 'Hello world', groupId);
    const description = text('Description', 'My awesome description', groupId);
    const isCrossOriginEnabled = boolean('Is CORS enabled', false, groupId);
    const crossOrigin = select('CORS', corsOptions, corsOptions.None, groupId);
    const isDisplayedTags = boolean('Display tags', true, groupId);
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
    const imageUrl = landscapeImageKnob('Url image', LANDSCAPE_IMAGES.landscape1, groupId);
    const focusPoint = {
        x: number('Focus X', 1, numberKnobOptions, groupId),
        y: number('Focus Y', 0, numberKnobOptions, groupId),
    };
    const size = select(
        'Size',
        {
            None: undefined,
            XL: Size.xl,
            XXL: Size.xxl,
        },
        Size.xxl,
        groupId,
    );

    return (
        <ImageBlock
            description={description}
            image={htmlDecode(imageUrl)}
            size={size}
            tags={isDisplayedTags && tags}
            title={title}
            theme={theme}
            thumbnailProps={{
                align,
                aspectRatio,
                crossOrigin,
                focusPoint,
                isCrossOriginEnabled,
            }}
        />
    );
};
