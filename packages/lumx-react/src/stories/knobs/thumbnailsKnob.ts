import { ThumbnailProps } from '@lumx/react';
import take from 'lodash/take';
import { imageKnob, IMAGES } from '@lumx/react/stories/knobs/image';

export const thumbnailsKnob = (num: number): ThumbnailProps[] =>
    take(Object.values(IMAGES), num).map((image, index) => ({
        alt: `Image ${index + 1}`,
        image: imageKnob(`Image ${index + 1}`, image),
    }));
