import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { Alignment, HorizontalAlignment, Size, Theme, Thumbnail } from '@lumx/react';

import { GenericProps, HasTheme, ValueOf } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
        align,
        alt,
        captionPosition,
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
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    captionPosition,
                    align,
                    size,
                    theme,
                }),
                fillHeight && `${CLASSNAME}--fill-height`,
            )}
        >
            <Thumbnail
                {...thumbnailProps}
                className={classNames(`${CLASSNAME}__image`, thumbnailProps?.className)}
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
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
        </figure>
    );
});
ImageBlock.displayName = COMPONENT_NAME;
ImageBlock.className = CLASSNAME;
ImageBlock.defaultProps = DEFAULT_PROPS;
