import React, { CSSProperties, ReactElement } from 'react';

import classNames from 'classnames';

import { Alignment, Size, Theme } from 'LumX';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import isFunction from 'lodash/isFunction';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';

/**
 * All available aspect ratios.
 */
enum ThumbnailAspectRatio {
    original = 'original',
    horizontal = 'horizontal',
    vertical = 'vertical',
    square = 'square',
}

/**
 *  Authorized size values.
 */
type ThumbnailSize = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Authorized variants.
 */
enum ThumbnailVariant {
    squared = 'squared',
    rounded = 'rounded',
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IThumbnailProps extends IGenericProps {
    /* The thumbnail alignment. */
    align?: Alignment;
    /* The image aspect ratio. */
    aspectRatio?: ThumbnailAspectRatio;
    /* Whether the image has to fill its container's height. */
    fillHeight?: boolean;
    /* Avatar image. */
    image: string;
    /* Size. */
    size?: ThumbnailSize;
    /* Theme. */
    theme?: Theme;
    /* Variant. */
    variant?: ThumbnailVariant;
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
    align: Alignment.left,
    aspectRatio: ThumbnailAspectRatio.original,
    fillHeight: false,
    size: undefined,
    theme: Theme.light,
    variant: ThumbnailVariant.squared,
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

    const { alt = 'Thumbnail', onClick = null, ...restProps } = props;

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
            {aspectRatio === ThumbnailAspectRatio.original ? (
                <img className="lumx-thumbnail__image" src={image} alt={alt} />
            ) : (
                <div className="lumx-thumbnail__background" style={style} />
            )}
        </div>
    );
};
Thumbnail.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Thumbnail, ThumbnailProps, ThumbnailAspectRatio, ThumbnailSize, ThumbnailVariant };
