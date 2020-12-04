import { mdiAbTesting } from '@lumx/icons';
import { Alignment, AspectRatio, CrossOrigin, Icon, Size, Theme, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { ThumbnailSize } from '@lumx/react/components/thumbnail/Thumbnail';
import { IMAGES, imageKnob } from '@lumx/react/stories/knobs';
import { htmlDecode } from '@lumx/react/utils/htmlDecode';
import { boolean, number, select } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/thumbnail/Thumbnail' };

interface StoryProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme: Theme;
}

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

const groupId = 'Options';

const ThumbnailSizes: Record<any, ThumbnailSize | undefined> = {
    None: undefined,
    XXS: Size.xxs,
    XS: Size.xs,
    S: Size.s,
    M: Size.m,
    L: Size.l,
    XL: Size.xl,
    XXL: Size.xxl,
};

/**
 * Thumbnail story
 * @return simple Thumbnail.
 */
export const DefaultThumbnail = ({ theme }: StoryProps) => {
    const align = select<Alignment>('Alignment', Alignment, Alignment.left, groupId);
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, groupId);
    const isCrossOriginEnabled = boolean('Is CORS enabled', false, groupId);
    const crossOrigin = select('CORS', corsOptions, corsOptions.None, groupId);
    const fillHeight = boolean('Fill Height', false, groupId);
    const focusPoint = {
        x: number('focusX', 0, numberKnobOptions, groupId),
        y: number('focusY', 0, numberKnobOptions, groupId),
    };
    const image = imageKnob('Image', IMAGES.landscape1, groupId);
    const isFollowingWindowSize = boolean('Update on window resize', true, groupId);
    const resizeDebounceTime = number('Debounce time after resize', 20, undefined, groupId);
    const variant = select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared, groupId);

    return (
        <Thumbnail
            align={align}
            aspectRatio={aspectRatio}
            isCrossOriginEnabled={isCrossOriginEnabled}
            crossOrigin={crossOrigin}
            fillHeight={fillHeight}
            focusPoint={focusPoint}
            image={htmlDecode(image)}
            isFollowingWindowSize={isFollowingWindowSize}
            resizeDebounceTime={resizeDebounceTime}
            size={select('Size', ThumbnailSizes, Size.xxl, groupId)}
            theme={theme}
            variant={variant}
        />
    );
};

export const ThumbnailFallBack = () => <Thumbnail image="foo" fallback={<Icon icon={mdiAbTesting} size={Size.xl} />} />;
