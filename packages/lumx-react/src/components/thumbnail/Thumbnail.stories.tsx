import React from 'react';

import { mdiAbTesting } from '@lumx/icons';
import {
    Alignment,
    AspectRatio,
    Badge,
    ColorPalette,
    FlexBox,
    Icon,
    Size,
    Thumbnail,
    ThumbnailVariant,
} from '@lumx/react';
import { imageKnob, IMAGES } from '@lumx/react/stories/knobs';
import { htmlDecode } from '@lumx/react/utils/htmlDecode';
import { boolean, select, text } from '@storybook/addon-knobs';
import { enumKnob } from '@lumx/react/stories/knobs/enumKnob';
import { focusKnob } from '@lumx/react/stories/knobs/focusKnob';
import { sizeKnob } from '@lumx/react/stories/knobs/sizeKnob';

export default { title: 'LumX components/thumbnail/Thumbnail' };

export const Default = () => <Thumbnail alt="Image alt text" image={imageKnob()} size={Size.xxl} />;

export const Clickable = () => <Thumbnail alt="Click me" image={imageKnob()} size={Size.xxl} onClick={console.log} />;

export const DefaultFallback = () => <Thumbnail alt="foo" image="foo" />;

export const IconFallback = () => <Thumbnail alt="foo" image="foo" fallback={mdiAbTesting} />;

export const CustomFallback = () => (
    <Thumbnail alt="foo" image="foo" fallback={<Thumbnail alt="missing image" image="/logo.svg" />} />
);

export const WithBadge = () => {
    const thumbnailSize = sizeKnob('Thumbnail size', Size.l);
    const variant = select<ThumbnailVariant>('Thumbnail variant', ThumbnailVariant, ThumbnailVariant.rounded);
    const badgeColor = select('Badge color', ColorPalette, ColorPalette.primary);
    const activateFallback = boolean('Activate fallback', false);
    const image = imageKnob();
    return (
        <Thumbnail
            alt="Image alt text"
            image={activateFallback ? '' : image}
            variant={variant}
            aspectRatio={AspectRatio.square}
            size={thumbnailSize}
            badge={
                <Badge color={badgeColor}>
                    <Icon icon={mdiAbTesting} />
                </Badge>
            }
        />
    );
};

export const ParentSizeConstraint = () => {
    const fillHeight = boolean('Fill Height', true);
    return Object.values(AspectRatio).map((aspectRatio) => (
        <FlexBox key={aspectRatio} orientation="horizontal" gap="huge">
            <h1>ratio: {aspectRatio}</h1>

            <div style={{ border: '1px solid red', width: 200, height: 400, resize: 'both', overflow: 'auto' }}>
                <Thumbnail alt="Grid" image="/demo-assets/grid.jpg" aspectRatio={aspectRatio} fillHeight={fillHeight} />
            </div>

            <div style={{ border: '1px solid red', width: 300, height: 300, resize: 'both', overflow: 'auto' }}>
                <Thumbnail alt="Grid" image="/demo-assets/grid.jpg" aspectRatio={aspectRatio} fillHeight={fillHeight} />
            </div>

            <div style={{ border: '1px solid red', width: 400, height: 200, resize: 'both', overflow: 'auto' }}>
                <Thumbnail alt="Grid" image="/demo-assets/grid.jpg" aspectRatio={aspectRatio} fillHeight={fillHeight} />
            </div>
        </FlexBox>
    ));
};

export const Knobs = ({ theme }: any) => {
    const alt = text('Alternative text', 'Image alt text');
    const align = enumKnob(
        'Alignment',
        [undefined, Alignment.center, Alignment.left, Alignment.right] as const,
        undefined,
    );
    const aspectRatio = enumKnob('Aspect ratio', [undefined, ...Object.values(AspectRatio)], undefined);
    const crossOrigin = enumKnob('CORS', [undefined, 'anonymous', 'use-credentials'] as const, undefined);
    const fillHeight = boolean('Fill Height', false);
    const focusPoint = { x: focusKnob('Focus X'), y: focusKnob('Focus Y') };
    const image = imageKnob('Image', IMAGES.landscape1);
    const variant = select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared);
    const size = sizeKnob('Size', Size.xxl);
    const onClick = boolean('clickable?', false) ? () => console.log('ok') : undefined;

    return (
        <Thumbnail
            alt={alt}
            align={align}
            aspectRatio={aspectRatio}
            crossOrigin={crossOrigin}
            fillHeight={fillHeight}
            focusPoint={focusPoint}
            image={htmlDecode(image)}
            size={size}
            theme={theme}
            variant={variant}
            onClick={onClick}
        />
    );
};
