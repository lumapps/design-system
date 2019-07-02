import React, { CSSProperties, ReactElement } from 'react';

import classNames from 'classnames';

import { Alignment, Alignments, Theme, Themes } from 'LumX/components';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import isFunction from 'lodash/isFunction';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';

/**
 * All available aspect ratios.
 */
const enum AspectRatios {
    original = 'original',
    horizontal = 'horizontal',
    vertical = 'vertical',
}
type AspectRatio = AspectRatios;

/**
 *  Authorized size values.
 */
enum Sizes {
    xxs = 'xxs',
    xs = 'xs',
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl',
}
type Size = Sizes;

/**
 * Authorized variants.
 */
enum Variants {
    squared = 'squared',
    rounded = 'rounded',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IThumbnailProps extends IGenericProps {
    /* The thumbnail alignment. */
    align?: Alignment;
    /* The image aspect ratio. */
    aspectRatio?: AspectRatio;
    /* Whether the image has to fill its container's height. */
    fillHeight?: boolean;
    /* Avatar image. */
    image: string;
    /* Size. */
    size?: Size;
    /* Theme. */
    theme?: Theme;
    /* Variant. */
    variant?: Variant;
}
type ThumbnailProps = IThumbnailProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ThumbnailProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Thumbnail`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    align: Alignments.left,
    aspectRatio: AspectRatios.original,
    fillHeight: false,
    size: undefined,
    theme: Themes.light,
    variant: Variants.squared,
};
/////////////////////////////

/**
 * Simple component used to display image with square or round shape.
 * Convenient to display image previews or user avatar.
 *
 * @return The component.
 */
const Thumbnail: React.FC<ThumbnailProps> = ({
    className = '',
    align = DEFAULT_PROPS.align,
    aspectRatio = DEFAULT_PROPS.aspectRatio,
    fillHeight = DEFAULT_PROPS.fillHeight,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    image,
    ...props
}: ThumbnailProps): ReactElement => {
    const style: CSSProperties = {
        backgroundImage: `url(${image})`,
    };

    const { alt = 'Thumbnail', onClick = null, ...restProps }: IDefaultPropsType = props;

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({ align, aspectRatio, prefix: CLASSNAME, size, theme, variant }),
                {
                    [`${CLASSNAME}--fill-height`]: fillHeight,
                },
            )}
            tabIndex={isFunction(onClick) ? 0 : -1}
            onClick={onClick}
            onKeyDown={onEnterPressed(onClick)}
            {...restProps}
        >
            {aspectRatio === AspectRatios.original ? (
                <img className="lumx-thumbnail__image" src={image} alt={alt} />
            ) : (
                <div className="lumx-thumbnail__background" style={style} />
            )}
        </div>
    );
};
Thumbnail.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    AspectRatio,
    AspectRatios,
    Sizes,
    Thumbnail,
    ThumbnailProps,
    Theme,
    Themes,
    Variants,
};
