import React, { CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Alignment, AspectRatio, Size, Theme, Thumbnail } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { ThumbnailProps } from '../thumbnail/Thumbnail';

/**
 * Authorized variants.
 */
enum ImageBlockCaptionPosition {
    below = 'below',
    over = 'over',
}

/**
 *  Authorized size values.
 */
type ImageBlockSize = Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
interface ImageBlockProps extends GenericProps {
    /** The action elements. */
    actions?: ReactNode;
    /** The position of the caption. */
    captionPosition?: ImageBlockCaptionPosition;
    /** The style to apply to the caption section. */
    captionStyle?: CSSProperties;
    /** The image description. Can be either a string, or sanitized html. */
    description?: string | { __html: string };
    /**
     * The url of the image we want to display.
     * @see {@link ThumbnailProps#image}
     */
    image: string;
    /** The size variant of the component. */
    size?: ImageBlockSize;
    /** The tags elements. */
    tags?: HTMLElement | ReactNode;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The props to pass to the thumbnail, minus those already set by the ImageBlock props. */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'size' | 'theme'>;
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ImageBlockProps> = {
    captionPosition: ImageBlockCaptionPosition.below,
    theme: Theme.light,
    thumbnailProps: {
        align: Alignment.left,
        aspectRatio: AspectRatio.original,
    },
};

const ImageBlock: React.FC<ImageBlockProps> = ({
    actions,
    captionPosition,
    captionStyle,
    className,
    description,
    image,
    size,
    tags,
    theme,
    thumbnailProps,
    title,
    ...forwardedProps
}) => {
    return (
        <div
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    align: thumbnailProps?.align,
                    aspectRatio: thumbnailProps?.aspectRatio,
                    fillHeight: thumbnailProps?.fillHeight,
                    captionPosition,
                    prefix: CLASSNAME,
                    size,
                    theme,
                }),
            )}
        >
            <Thumbnail
                {...thumbnailProps}
                className={classNames(`${CLASSNAME}__image`, thumbnailProps?.className)}
                image={image}
                size={size}
                theme={theme}
            />
            {(title || description || tags) && (
                <div className={`${CLASSNAME}__wrapper`} style={captionStyle}>
                    {(title || description) && (
                        <div className={`${CLASSNAME}__caption`}>
                            {title && <span className={`${CLASSNAME}__title`}>{title}</span>}
                            {/* Add an `&nbsp;` when there is description and title. */}
                            {title && description && '\u00A0'}
                            {isObject(description) && description.__html ? (
                                <span dangerouslySetInnerHTML={description} className={`${CLASSNAME}__description`} />
                            ) : (
                                <span className={`${CLASSNAME}__description`}>{description}</span>
                            )}
                        </div>
                    )}
                    {tags && <div className={`${CLASSNAME}__tags`}>{tags}</div>}
                </div>
            )}
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
        </div>
    );
};
ImageBlock.displayName = COMPONENT_NAME;
ImageBlock.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, ImageBlockCaptionPosition, ImageBlock, ImageBlockProps };
