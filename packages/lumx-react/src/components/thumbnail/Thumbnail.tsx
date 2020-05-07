import React, { ImgHTMLAttributes, ReactElement } from 'react';

import classNames from 'classnames';

import { Alignment, AspectRatio, FocusPoint, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import isFunction from 'lodash/isFunction';

import { GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import useFocusedImage from './useFocusedImage';

import { isInternetExplorer } from '@lumx/react/utils/isInternetExplorer';

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
const ThumbnailAspectRatio: Record<string, AspectRatio> = { ...AspectRatio };

/**
 *  Authorized size values.
 */
type ThumbnailSize = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 *  Cross-origin values.
 */
enum CrossOrigin {
    anonymous = 'anonymous',
    useCredentials = 'use-credentials',
}

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
    /** Active cross origin. */
    isCrossOriginEnabled?: boolean;
    /**
     * Allows images that are loaded from foreign origins
     * to be used as if they had been loaded from the current origin.
     */
    crossOrigin?: CrossOrigin;
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
    /** Allows to re-center the image according to the focal point after after window resizing */
    isFollowingWindowSize?: boolean;
    /** Time before recalculating focal point if isFollowingWindowSize is activated */
    resizeDebounceTime?: number;
    /** props that will be passed directly to the `img` tag */
    imgProps?: ImgHTMLAttributes<HTMLImageElement>;
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
    isCrossOriginEnabled: true,
    crossOrigin: CrossOrigin.anonymous,
    aspectRatio: AspectRatio.original,
    fillHeight: false,
    focusPoint: { x: 0, y: 0 },
    loading: ImageLoading.lazy,
    size: undefined,
    theme: Theme.light,
    variant: ThumbnailVariant.squared,
    debounceTime: 20,
    isFollowingWindowSize: true,
};

/**
 * Simple component used to display image with square or round shape.
 * Convenient to display image previews or user avatar.
 *
 * @return The component.
 */
const Thumbnail: React.FC<ThumbnailProps> = ({
    className = '',
    isCrossOriginEnabled = DEFAULT_PROPS.isCrossOriginEnabled,
    crossOrigin = DEFAULT_PROPS.crossOrigin,
    debounceTime = DEFAULT_PROPS.debounceTime,
    isFollowingWindowSize = DEFAULT_PROPS.isFollowingWindowSize,
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
    imgProps,
    ...props
}: ThumbnailProps): ReactElement => {
    const focusImageRef = useFocusedImage(focusPoint!, aspectRatio!, size!, debounceTime!, isFollowingWindowSize!);

    const setCrossOrigin = () => {
        return !isInternetExplorer() && isCrossOriginEnabled ? crossOrigin : undefined;
    };

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
                <img
                    ref={focusImageRef}
                    className={`${CLASSNAME}__image`}
                    src={image}
                    alt={alt}
                    loading={loading}
                    {...(imgProps || {})}
                />
            ) : (
                <div className={`${CLASSNAME}__background`}>
                    <img
                        ref={focusImageRef}
                        className={`${CLASSNAME}__focused-image`}
                        crossOrigin={setCrossOrigin()}
                        src={image}
                        alt={alt}
                        loading={loading}
                        {...(imgProps || {})}
                    />
                </div>
            )}
        </div>
    );
};
Thumbnail.displayName = COMPONENT_NAME;

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Thumbnail,
    ThumbnailProps,
    ThumbnailAspectRatio,
    ThumbnailSize,
    ThumbnailVariant,
    CrossOrigin,
};
