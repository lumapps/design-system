import React, { CSSProperties } from 'react';

import classNames from 'classnames';

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
    /** Caption position. */
    captionPosition?: CaptionPosition;
    /* Theme. */
    theme?: Theme;
    /* Image url. */
    image: string;
    /** The height of the image to set. */
    imageHeight?: number | string;
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
    aspectRatio: AspectRatios.horizontal,
    captionPosition: CaptionPositions.below,
    imageHeight: 'auto',
    theme: Themes.light,
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
    captionPosition = DEFAULT_PROPS.captionPosition,
    image,
    imageHeight = DEFAULT_PROPS.imageHeight,
    theme = DEFAULT_PROPS.theme,
    ...props
}: ImageBlockProps): React.ReactElement => {
    const style: CSSProperties = {
        backgroundImage: `url(${image})`,
        height: aspectRatio === 'original' ? imageHeight : undefined,
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, aspectRatio, captionPosition, theme }),
                {
                    [`${CLASSNAME}--format-crop`]: aspectRatio && aspectRatio !== 'original',
                    [`${CLASSNAME}--format-original`]: !aspectRatio || aspectRatio === 'original',
                },
            )}
            {...props}
        >
            <div className={`${CLASSNAME}__image`} style={style} />
        </div>
    );
};
ImageBlock.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, AspectRatios, CaptionPositions, ImageBlock, ImageBlockProps, Theme, Themes };
