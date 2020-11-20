import { Alignment, AspectRatio, CrossOrigin, Size, Theme, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { htmlDecode } from '@lumx/react/utils/htmlDecode';
import { boolean, number, select, text } from '@storybook/addon-knobs';
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

/**
 * Thumbnail story
 * @return simple Thumbnail.
 */
export const defaultThumbnail = ({ theme }: StoryProps) => {
    const align = select<Alignment>('Alignment', Alignment, Alignment.left, groupId);
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, groupId);
    const isCrossOriginEnabled = boolean('Is CORS enabled', false, groupId);
    const crossOrigin = select('CORS', corsOptions, corsOptions.None, groupId);
    const fillHeight = boolean('Fill Height', false, groupId);
    const focusPoint = {
        x: number('focusX', 0, numberKnobOptions, groupId),
        y: number('focusY', 0, numberKnobOptions, groupId),
    };
    const image = text(
        'Url',
        'https://i.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
        groupId,
    );
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
            size={select(
                'Size',
                {
                    None: undefined,
                    XXS: Size.xxs,
                    XS: Size.xs,
                    S: Size.s,
                    M: Size.m,
                    L: Size.l,
                    XL: Size.xl,
                    XXL: Size.xxl,
                },
                Size.xxl,
                groupId,
            )}
            theme={theme}
            variant={variant}
        />
    );
};

export const thumbnailWithCustomImgProps = ({ theme }: StoryProps) => {
    const [image, setImage] = React.useState('https://not-found');
    const onError = () => {
        // tslint:disable-next-line: no-console
        console.log('onError event called');
        setImage('https://i.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0');
    };

    const align = select<Alignment>('Alignment', Alignment, Alignment.left, groupId);
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, groupId);
    const isCrossOriginEnabled = boolean('Is CORS enabled', false, groupId);
    const crossOrigin = select('CORS', corsOptions, corsOptions.Anonymous, groupId);
    const fillHeight = boolean('Fill Height', false, groupId);
    const focusPoint = {
        x: number('focusX', 0, numberKnobOptions, groupId),
        y: number('focusY', 0, numberKnobOptions, groupId),
    };
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
            image={image}
            imgProps={{ onError }}
            isFollowingWindowSize={isFollowingWindowSize}
            size={select(
                'Size',
                {
                    None: undefined,
                    XXS: Size.xxs,
                    XS: Size.xs,
                    S: Size.s,
                    M: Size.m,
                    L: Size.l,
                    XL: Size.xl,
                    XXL: Size.xxl,
                },
                Size.xxl,
                groupId,
            )}
            resizeDebounceTime={resizeDebounceTime}
            theme={theme}
            variant={variant}
        />
    );
};

export const brokenThumbnailWithFallbackProps = ({ theme }: StoryProps) => {
    const align = select<Alignment>('Alignment', Alignment, Alignment.left, groupId);
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, groupId);
    const isCrossOriginEnabled = boolean('Is CORS enabled', false, groupId);
    const crossOrigin = select('CORS', corsOptions, corsOptions.None, groupId);
    const fillHeight = boolean('Fill Height', false, groupId);
    const image = text(
        'Url',
        'https://i.picsum.photos/id/237/536/354.jp?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
        groupId,
    );
    const variant = select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared, groupId);

    return (
        <Thumbnail
            align={align}
            aspectRatio={aspectRatio}
            isCrossOriginEnabled={isCrossOriginEnabled}
            crossOrigin={crossOrigin}
            fillHeight={fillHeight}
            image={htmlDecode(image)}
            theme={theme}
            variant={variant}
        />
    );
};
