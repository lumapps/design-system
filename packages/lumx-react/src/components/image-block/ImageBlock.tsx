import React, { CSSProperties, forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Alignment, HorizontalAlignment, Size, Theme, Thumbnail } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { ThumbnailProps } from '../thumbnail/Thumbnail';

/**
 * Authorized variants.
 */
export enum ImageBlockCaptionPosition {
    below = 'below',
    over = 'over',
}

/**
 *  Authorized size values.
 */
export type ImageBlockSize = Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
export interface ImageBlockProps extends GenericProps {
    /** The action elements. */
    actions?: ReactNode;
    /** The thumbnail alignment. */
    align?: HorizontalAlignment;
    /** The thumbnail image alternative text. */
    alt: string;
    /** The position of the caption. */
    captionPosition?: ImageBlockCaptionPosition;
    /** The style to apply to the caption section. */
    captionStyle?: CSSProperties;
    /** The image description. Can be either a string, or sanitized html. */
    description?: string | { __html: string };
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /**
     * The url of the image we want to display.
     * @see {@link ThumbnailProps#image}
     */
    image: string;
    /** The size variant of the component. */
    size?: ImageBlockSize;
    /** The tags elements. */
    tags?: ReactNode;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The props to pass to the thumbnail, minus those already set by the ImageBlock props. */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'size' | 'theme' | 'align' | 'fillHeight'>;
    /** The image title to display in the caption. */
    title?: string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ImageBlock`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
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
