import { ReactNode } from 'react';

import { Alignment, HorizontalAlignment, Size, Theme, Thumbnail } from '@lumx/react';

import { GenericProps, HasTheme, ValueOf } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { ThumbnailProps } from '../thumbnail/Thumbnail';
import { ImageCaption, ImageCaptionMetadata } from './ImageCaption';

/**
 * Image block variants.
 */
export const ImageBlockCaptionPosition = {
    below: 'below',
    over: 'over',
} as const;
export type ImageBlockCaptionPosition = ValueOf<typeof ImageBlockCaptionPosition>;

/**
 *  Image block sizes.
 */
export type ImageBlockSize = Extract<Size, 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface ImageBlockProps extends GenericProps, HasTheme, ImageCaptionMetadata {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Alignment. */
    align?: HorizontalAlignment;
    /** Image alternative text. */
    alt: string;
    /** Caption position. */
    captionPosition?: ImageBlockCaptionPosition;
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** Image URL. */
    image: string;
    /** Size variant. */
    size?: ImageBlockSize;
    /** Props to pass to the thumbnail (minus those already set by the ImageBlock props). */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'size' | 'theme' | 'align' | 'fillHeight'>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ImageBlock';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-image-block';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ImageBlockProps> = {
    captionPosition: ImageBlockCaptionPosition.below,
    align: Alignment.left,
};

/**
 * ImageBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ImageBlock = forwardRef<ImageBlockProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        actions,
        align = DEFAULT_PROPS.align,
        alt,
        captionPosition = DEFAULT_PROPS.captionPosition,
        captionStyle,
        className,
        description,
        descriptionProps,
        fillHeight,
        image,
        size,
        tags,
        theme = defaultTheme,
        thumbnailProps,
        title,
        titleProps,
        ...forwardedProps
    } = props;
    return (
        <figure
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`caption-position-${captionPosition}`]: Boolean(captionPosition),
                    [`align-${align}`]: Boolean(align),
                    [`size-${size}`]: Boolean(size),
                    [`theme-${theme}`]: Boolean(theme),
                    'fill-height': fillHeight,
                }),
            )}
        >
            <Thumbnail
                {...thumbnailProps}
                className={classNames.join(element('image'), thumbnailProps?.className)}
                fillHeight={fillHeight}
                align={align}
                image={image}
                size={size}
                theme={theme}
                alt={(alt || title) as string}
            />
            <ImageCaption
                as="figcaption"
                baseClassName={CLASSNAME}
                theme={theme}
                title={title}
                titleProps={titleProps}
                description={description}
                descriptionProps={descriptionProps}
                tags={tags}
                captionStyle={captionStyle}
                align={align}
                truncate={captionPosition === 'over'}
            />
            {actions && <div className={element('actions')}>{actions}</div>}
        </figure>
    );
});
ImageBlock.displayName = COMPONENT_NAME;
ImageBlock.className = CLASSNAME;
ImageBlock.defaultProps = DEFAULT_PROPS;
