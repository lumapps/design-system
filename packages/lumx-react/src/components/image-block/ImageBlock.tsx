import React, { CSSProperties, forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Alignment, HorizontalAlignment, Size, Theme, Thumbnail } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses, ValueOf } from '@lumx/react/utils';
import { ThumbnailProps } from '../thumbnail/Thumbnail';

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
export interface ImageBlockProps extends GenericProps {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Alignment. */
    align?: HorizontalAlignment;
    /** Image alternative text. */
    alt: string;
    /** Caption position. */
    captionPosition?: ImageBlockCaptionPosition;
    /** Caption custom CSS style. */
    captionStyle?: CSSProperties;
    /** Image description. Can be either a string, or sanitized html. */
    description?: string | { __html: string };
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** Image URL. */
    image: string;
    /** Size variant. */
    size?: ImageBlockSize;
    /** Tag content. */
    tags?: ReactNode;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Props to pass to the thumbnail (minus those already set by the ImageBlock props). */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'size' | 'theme' | 'align' | 'fillHeight'>;
    /** Image title to display in the caption. */
    title?: string;
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
    theme: Theme.light,
    align: Alignment.left,
};

/**
 * ImageBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ImageBlock: Comp<ImageBlockProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        actions,
        align,
        alt,
        captionPosition,
        captionStyle,
        className,
        description,
        fillHeight,
        image,
        size,
        tags,
        theme,
        thumbnailProps,
        title,
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
            {(title || description || tags) && (
                <figcaption className={`${CLASSNAME}__wrapper`} style={captionStyle}>
                    {(title || description) && (
                        <div className={`${CLASSNAME}__caption`}>
                            {title && <span className={`${CLASSNAME}__title`}>{title}</span>}
                            {/* Add an `&nbsp;` when there is description and title. */}
                            {title && description && '\u00A0'}
                            {isObject(description) && description.__html ? (
                                // eslint-disable-next-line react/no-danger
                                <span dangerouslySetInnerHTML={description} className={`${CLASSNAME}__description`} />
                            ) : (
                                <span className={`${CLASSNAME}__description`}>{description}</span>
                            )}
                        </div>
                    )}
                    {tags && <div className={`${CLASSNAME}__tags`}>{tags}</div>}
                </figcaption>
            )}
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
        </figure>
    );
});
ImageBlock.displayName = COMPONENT_NAME;
ImageBlock.className = CLASSNAME;
ImageBlock.defaultProps = DEFAULT_PROPS;
