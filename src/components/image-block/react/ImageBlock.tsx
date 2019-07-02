import React, { CSSProperties, ReactElement } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Chip, ChipSizes, Thumbnail, ThumbnailAspectRatio, ThumbnailAspectRatios } from 'LumX';
import { Alignment, Alignments, Theme, Themes } from 'LumX/components';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Authorized variants.
 */
enum CaptionPositions {
    below = 'below',
    over = 'over',
}
type CaptionPosition = CaptionPositions;

/**
 * Defines the props of the component.
 */
interface IImageBlockProps extends IGenericProps {
    /** The caption wrapper alignment. */
    align?: Alignment;
    /** The aspect ratio the image will get. */
    aspectRatio?: ThumbnailAspectRatio;
    /** Caption position. */
    captionPosition?: CaptionPosition;
    /** The style to apply to the caption section. */
    captionStyle?: CSSProperties;
    /** The image description. Can be either a string, or sanitized html. */
    description?:
        | string
        | {
              __html: string;
          };
    /* Whether the image has to fill its container's height. */
    fillHeight?: boolean;
    /* The url of the image we want to display in the image-block. */
    image: string;
    /** A list of tags, those tags will be displayed in a chip component. */
    tags?: string[];
    /* The theme to use to display the image-block. */
    theme?: Theme;
    /** The image title to display in the caption. */
    title?: string;
}
type ImageBlockProps = IImageBlockProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ImageBlockProps> {}

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
const DEFAULT_PROPS: IDefaultPropsType = {
    align: Alignments.left,
    aspectRatio: ThumbnailAspectRatios.original,
    captionPosition: CaptionPositions.below,
    captionStyle: {},
    description: undefined,
    fillHeight: false,
    tags: undefined,
    theme: Themes.light,
    title: undefined,
};

/////////////////////////////

/**
 * Displays an properly structured image block.
 *
 * @return The component.
 */
const ImageBlock: React.FC<ImageBlockProps> = ({
    align = DEFAULT_PROPS.align,
    aspectRatio = DEFAULT_PROPS.aspectRatio,
    className = '',
    captionPosition = DEFAULT_PROPS.captionPosition,
    captionStyle = DEFAULT_PROPS.captionStyle,
    description = DEFAULT_PROPS.description,
    fillHeight = DEFAULT_PROPS.fillHeight,
    image,
    tags = DEFAULT_PROPS.tags,
    theme = DEFAULT_PROPS.theme,
    title = DEFAULT_PROPS.title,
    ...props
}: ImageBlockProps): ReactElement => {
    const { onClick = null, ...restProps }: IDefaultPropsType = props;

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    align,
                    aspectRatio,
                    captionPosition,
                    prefix: CLASSNAME,
                    theme,
                }),
                {
                    [`${CLASSNAME}--fill-height`]: fillHeight,
                    [`${CLASSNAME}--format-crop`]: aspectRatio && aspectRatio !== 'original',
                    [`${CLASSNAME}--format-original`]: !aspectRatio || aspectRatio === 'original',
                },
            )}
            {...restProps}
        >
            <Thumbnail
                align={align}
                className={`${CLASSNAME}__image`}
                aspectRatio={aspectRatio}
                fillHeight={fillHeight}
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
                    {tags && tags.length > 0 && (
                        <div className={`${CLASSNAME}__tags`}>
                            {tags.map(
                                (tag: string, index: number): JSX.Element => (
                                    <div key={index} className={`${CLASSNAME}__tag`}>
                                        <Chip size={ChipSizes.s} theme={theme}>
                                            {tag}
                                        </Chip>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
ImageBlock.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, CaptionPositions, ImageBlock, ImageBlockProps, Theme, Themes };
