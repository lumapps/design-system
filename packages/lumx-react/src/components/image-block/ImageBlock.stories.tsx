import { LANDSCAPE_IMAGES, landscapeImageKnob } from '@lumx/react/stories/knobs';
import React from 'react';

import { Alignment, AspectRatio, Chip, ChipGroup, ImageBlock, Size } from '@lumx/react';
import { htmlDecode } from '@lumx/react/utils/htmlDecode';
import { boolean, select, text } from '@storybook/addon-knobs';
import { enumKnob } from '@lumx/react/stories/knobs/enumKnob';
import { focusKnob } from '@lumx/react/stories/knobs/focusKnob';

export default { title: 'LumX components/image-block/Image Block' };

export const DefaultImageBlock = ({ theme }: any) => {
    const alt = text('Alternative text', 'Image alt text');
    const align = select<Alignment>('Alignment', Alignment, Alignment.center) as any;
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square);
    const title = text('Title', 'Hello world');
    const description = text('Description', 'My awesome description');
    const crossOrigin = enumKnob('CORS', [undefined, 'anonymous', 'use-credentials'], undefined);
    const tags = boolean('Display tags', true) && (
        <ChipGroup align={Alignment.left}>
            <Chip size={Size.s} theme={theme}>
                Tag 1
            </Chip>

            <Chip size={Size.s} theme={theme}>
                Tag 2
            </Chip>
        </ChipGroup>
    );
    const imageUrl = landscapeImageKnob('Url image', LANDSCAPE_IMAGES.landscape1);
    const focusPoint = { x: focusKnob('Focus X'), y: focusKnob('Focus Y') };
    const size = enumKnob('Size', [undefined, Size.xl, Size.xxl] as const, undefined);
    const onClick = boolean('clickable?', false) && (() => console.log('ok'));

    return (
        <ImageBlock
            alt={alt}
            description={description}
            image={htmlDecode(imageUrl)}
            size={size}
            tags={tags}
            title={title}
            theme={theme}
            align={align}
            thumbnailProps={{
                aspectRatio,
                crossOrigin,
                focusPoint,
                onClick,
            }}
        />
    );
};
