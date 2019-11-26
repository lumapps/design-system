import React, { CSSProperties, ReactElement } from 'react';

import classNames from 'classnames';

import { Alignment, AspectRatio, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import isFunction from 'lodash/isFunction';

import { IGenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

/**
 * Loading attribute is not yet supported in typescript, so we need
 * to add it in order to avoid a ts error.
 * https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/blob/master/ADVANCED.md#adding-non-standard-attributes
 */
declare module 'react' {
    // tslint:disable-next-line: interface-name
    interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
        loading?: 'auto' | 'eager' | 'lazy';
    }
}

/**
 * All available aspect ratios.
 * @deprecated
 */
const ThumbnailAspectRatio: Record<string, AspectRatio> = {
    horizontal: AspectRatio.horizontal,
    original: AspectRatio.original,
    square: AspectRatio.square,
    vertical: AspectRatio.vertical,
};

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

/**
 * Authorized types of image loading.
 */
enum ImageLoading {
    auto = 'auto',
    lazy = 'lazy',
    eager = 'eager',
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IThumbnailProps extends IGenericProps {
    /** The thumbnail alignment. */
    align?: Alignment;
    /** The image aspect ratio. */
    aspectRatio?: AspectRatio;
    /** Whether the image has to fill its container's height. */
    fillHeight?: boolean;
    /** Avatar image. */
    image: string;
    /** Size. */
    size?: ThumbnailSize;
    /** Image Loading mode */
    loading?: ImageLoading;
    /** Theme. */
    theme?: Theme;
    /** Variant. */
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
    aspectRatio: AspectRatio.original,
    fillHeight: false,
    loading: ImageLoading.lazy,
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
    loading = DEFAULT_PROPS.loading,
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
            {aspectRatio === AspectRatio.original ? (
                <img className="lumx-thumbnail__image" src={image} alt={alt} loading={loading} />
            ) : (
                <div className="lumx-thumbnail__background" style={style} />
            )}
        </div>
    );
};
Thumbnail.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Thumbnail, ThumbnailProps, ThumbnailAspectRatio, ThumbnailSize, ThumbnailVariant };
