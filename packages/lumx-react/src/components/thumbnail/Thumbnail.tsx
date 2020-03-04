import React from 'react';

import classNames from 'classnames';

import { Alignment, AspectRatio, FocusPoint, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import isFunction from 'lodash/isFunction';

import { GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import useFocusedImage from './useFocusedImage';

/**
 * Loading attribute is not yet supported in typescript, so we need
 * to add it in order to avoid a ts error.
 * https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/blob/master/ADVANCED.md#adding-non-standard-attributes
 */
declare module 'react' {
    interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
        loading?: 'auto' | 'eager' | 'lazy';
    }
}

/**
 * All available aspect ratios.
 * @deprecated
 */
const ThumbnailAspectRatio: Record<string, AspectRatio> = { ...AspectRatio };

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

/**
 * Defines the props of the component.
 */
interface ThumbnailProps extends GenericProps {
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

    /** Focal Point coordinates. */
    focusPoint?: FocusPoint;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ThumbnailProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    align: Alignment.left,
    aspectRatio: AspectRatio.original,
    fillHeight: false,
    focusPoint: { x: 0, y: 0 },
    loading: ImageLoading.lazy,
    size: undefined,
    theme: Theme.light,
    variant: ThumbnailVariant.squared,
};

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
    alt = 'Thumbnail',
    onClick = null,
    focusPoint = DEFAULT_PROPS.focusPoint,
    ...props
}) => {
    const focusImageRef = useFocusedImage(focusPoint!);

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
            {...props}
        >
            {aspectRatio === AspectRatio.original ? (
                <img className={`${CLASSNAME}__image`} src={image} alt={alt} loading={loading} />
            ) : (
                <div className={`${CLASSNAME}__background`}>
                    <img
                        ref={focusImageRef}
                        className={`${CLASSNAME}__focused-image`}
                        crossOrigin="anonymous"
                        src={image}
                        alt={alt}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};
Thumbnail.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Thumbnail, ThumbnailProps, ThumbnailAspectRatio, ThumbnailSize, ThumbnailVariant };
