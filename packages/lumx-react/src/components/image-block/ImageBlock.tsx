import React, { CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Alignment, AspectRatio, CrossOrigin, FocusPoint, Size, Theme, Thumbnail } from '@lumx/react';

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
    /**
     * The caption wrapper alignment.
     * @see {@link ThumbnailProps#align}
     */
    align?: Alignment;
    /**
     * The aspect ratio the image will get.
     * @see {@link ThumbnailProps#aspectRatio}
     */
    aspectRatio?: AspectRatio;
    /** The position of the caption. */
    captionPosition?: ImageBlockCaptionPosition;
    /** The style to apply to the caption section. */
    captionStyle?: CSSProperties;
    /**
     * Allows images that are loaded from foreign origins to be used as if they had been loaded from the current origin.
     * @see {@link ThumbnailProps#crossOrigin}
     */
    crossOrigin?: CrossOrigin;
    /** The image description. Can be either a string, or sanitized html. */
    description?: string | { __html: string };
    /**
     * Whether the image has to fill its container's height.
     * @see {@link ThumbnailProps#fillHeight}
     */
    fillHeight?: boolean;
    /**
     * The focal point coordinates.
     * @see {@link ThumbnailProps#focusPoint}
     */
    focusPoint?: FocusPoint;
    /**
     * The url of the image we want to display.
     * @see {@link ThumbnailProps#image}
     */
    image: string;
    /** The props to pass to the thumbnail, minus those already set by the ImageBlock props. */
    thumbnailProps?: Omit<
        ThumbnailProps,
        | 'align'
        | 'aspectRatio'
        | 'crossOrigin'
        | 'fillHeight'
        | 'focusPoint'
        | 'image'
        | 'isCrossOriginEnabled'
        | 'size'
        | 'theme'
        | 'onClick'
    >;
    /**
     * Whether the cross origin attribute is enabled.
     * @see {@link ThumbnailProps#isCrossOriginEnabled}
     */
    isCrossOriginEnabled?: boolean;
    /**
     * The size variant of the component.
     * @see {@link ThumbnailProps#size}
     */
    size?: ImageBlockSize;
    /** Tags elements to be transcluded into the component */
    tags?: HTMLElement | ReactNode;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The image title to display in the caption. */
    title?: string;
    /**
     * The function called on click.
     * @see {@link ThumbnailProps#onClick}
     */
    onClick?(): void;
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
    align: Alignment.left,
    aspectRatio: AspectRatio.original,
    captionPosition: ImageBlockCaptionPosition.below,
    captionStyle: {},
    fillHeight: false,
    theme: Theme.light,
};

const ImageBlock: React.FC<ImageBlockProps> = ({
    actions,
    align,
    aspectRatio,
    captionPosition,
    captionStyle,
    className,
    crossOrigin,
    description,
    fillHeight,
    focusPoint,
    image,
    isCrossOriginEnabled,
    onClick,
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
                    align,
                    aspectRatio,
                    captionPosition,
                    prefix: CLASSNAME,
                    size,
                    theme,
                }),
                {
                    [`${CLASSNAME}--fill-height`]: fillHeight,
                    [`${CLASSNAME}--format-crop`]: aspectRatio && aspectRatio !== AspectRatio.original,
                    [`${CLASSNAME}--format-original`]: !aspectRatio || aspectRatio === AspectRatio.original,
                },
            )}
        >
            <Thumbnail
                {...thumbnailProps}
                align={align}
                aspectRatio={aspectRatio}
                className={classNames(`${CLASSNAME}__image`, thumbnailProps?.className)}
                crossOrigin={crossOrigin}
                fillHeight={fillHeight}
                focusPoint={focusPoint}
                image={image}
                isCrossOriginEnabled={isCrossOriginEnabled}
                onClick={onClick}
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
