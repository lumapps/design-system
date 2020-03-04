import React, { CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Alignment, AspectRatio, FocusPoint, Size, Theme, Thumbnail } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

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
    /** The caption wrapper alignment. */
    align?: Alignment;
    /** The aspect ratio the image will get. */
    aspectRatio?: AspectRatio;
    /** Caption position. */
    captionPosition?: ImageBlockCaptionPosition;
    /** The style to apply to the caption section. */
    captionStyle?: CSSProperties;
    /** The image description. Can be either a string, or sanitized html. */
    description?:
        | string
        | {
              __html: string;
          };
    /** Whether the image has to fill its container's height. */
    fillHeight?: boolean;
    /** Focal Point coordinates. */
    focusPoint?: FocusPoint;
    /** The url of the image we want to display in the image-block. */
    image: string;
    /** The image block size. */
    size?: ImageBlockSize;
    /** Tags elements to be transcluded into the component */
    tags?: HTMLElement | ReactNode;
    /** The theme to use to display the image-block. */
    theme?: Theme;
    /** The image title to display in the caption. */
    title?: string;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ImageBlockProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: DefaultPropsType = {
    actions: undefined,
    align: Alignment.left,
    aspectRatio: AspectRatio.original,
    captionPosition: ImageBlockCaptionPosition.below,
    captionStyle: {},
    description: undefined,
    fillHeight: false,
    focusPoint: undefined,
    size: undefined,
    tags: undefined,
    theme: Theme.light,
    title: undefined,
};

/////////////////////////////

/**
 * Displays an properly structured image block.
 *
 * @return The component.
 */
const ImageBlock: React.FC<ImageBlockProps> = ({
    actions = DEFAULT_PROPS.actions,
    align = DEFAULT_PROPS.align,
    aspectRatio = DEFAULT_PROPS.aspectRatio,
    className = '',
    captionPosition = DEFAULT_PROPS.captionPosition,
    captionStyle = DEFAULT_PROPS.captionStyle,
    description = DEFAULT_PROPS.description,
    fillHeight = DEFAULT_PROPS.fillHeight,
    focusPoint = DEFAULT_PROPS.focusPoint,
    image,
    size = DEFAULT_PROPS.size,
    tags = DEFAULT_PROPS.tags,
    theme = DEFAULT_PROPS.theme,
    title = DEFAULT_PROPS.title,
    ...props
}) => {
    const { onClick = null, ...restProps } = props;

    return (
        <div
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
            {...restProps}
        >
            <Thumbnail
                align={align}
                className={`${CLASSNAME}__image`}
                aspectRatio={aspectRatio}
                size={size}
                fillHeight={fillHeight}
                focusPoint={focusPoint}
                image={image}
                onClick={onClick}
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

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ImageBlockCaptionPosition, ImageBlock, ImageBlockProps };
