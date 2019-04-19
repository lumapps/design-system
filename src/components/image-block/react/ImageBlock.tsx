import React, { CSSProperties } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Chip, ChipSizes } from 'LumX';
import { Theme, Themes } from 'LumX/components';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * All available aspect ratios.
 */
enum AspectRatios {
    original = 'original',
    horizontal = 'horizontal',
    vertical = 'vertical',
}
type AspectRatio = AspectRatios;

/**
 * Authorized caption alignments.
 */
const enum CaptionAlignments {
    center = 'center',
    left = 'left',
    right = 'right',
}
type CaptionAlignment = CaptionAlignments;

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
    aspectRatio?: AspectRatio;
    /** The caption wrapper alignment. */
    captionAlign?: CaptionAlignment;
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
    hasFilledHeight?: boolean;
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
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}ImageBlock`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    aspectRatio: AspectRatios.original,
    captionAlign: CaptionAlignments.left,
    captionPosition: CaptionPositions.below,
    captionStyle: {},
    description: undefined,
    hasFilledHeight: false,
    tags: undefined,
    theme: Themes.light,
    title: undefined,
};

/////////////////////////////

/**
 * Displays an properly structured image block.
 *
 * @return {React.ReactElement} The component.
 */
const ImageBlock: React.FC<ImageBlockProps> = ({
    aspectRatio = DEFAULT_PROPS.aspectRatio,
    className = '',
    captionAlign = DEFAULT_PROPS.captionAlign,
    captionPosition = DEFAULT_PROPS.captionPosition,
    captionStyle = DEFAULT_PROPS.captionStyle,
    description = DEFAULT_PROPS.description,
    hasFilledHeight = DEFAULT_PROPS.hasFilledHeight,
    image,
    tags = DEFAULT_PROPS.tags,
    theme = DEFAULT_PROPS.theme,
    title = DEFAULT_PROPS.title,
    ...props
}: ImageBlockProps): React.ReactElement => {
    const style: CSSProperties = {
        backgroundImage: aspectRatio === AspectRatios.original ? undefined : `url(${image})`,
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    aspectRatio,
                    captionAlign,
                    captionPosition,
                    prefix: CLASSNAME,
                    theme,
                }),
                {
                    [`${CLASSNAME}--fill-height`]: hasFilledHeight,
                    [`${CLASSNAME}--format-crop`]: aspectRatio && aspectRatio !== 'original',
                    [`${CLASSNAME}--format-original`]: !aspectRatio || aspectRatio === 'original',
                },
            )}
            {...props}
        >
            <div className={`${CLASSNAME}__image`} style={style}>
                {aspectRatio === AspectRatios.original && <img src={image} alt={title} />}
            </div>
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
                                        <Chip LabelComponent={tag} size={ChipSizes.s} theme={theme} />
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

export {
    CLASSNAME,
    DEFAULT_PROPS,
    AspectRatios,
    CaptionAlignments,
    CaptionPositions,
    ImageBlock,
    ImageBlockProps,
    Theme,
    Themes,
};
