import React, { ImgHTMLAttributes, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';

import { Alignment, AspectRatio, FocusPoint, Icon, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import isFunction from 'lodash/isFunction';

import { GenericProps, ValueOf, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import { mdiImageBrokenVariant } from '@lumx/icons';
import { useFocusedImage } from '@lumx/react/hooks/useFocusedImage';
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
 *  Authorized size values.
 */
type ThumbnailSize = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 *  Thumbnail status.
 */
type ThumbnailStates = 'isLoading' | 'hasError' | 'isLoaded';

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
    align?: ValueOf<Alignment>;
    /** The image aspect ratio. */
    aspectRatio?: ValueOf<AspectRatio>;
    /**
     * Allows images that are loaded from foreign origins
     * to be used as if they had been loaded from the current origin.
     */
    crossOrigin?: ValueOf<CrossOrigin>;
    /** The fallback svg or react node. */
    fallback?: string | ReactNode;
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** The focal Point coordinates. */
    focusPoint?: FocusPoint;
    /** The avatar image. */
    image: string;
    /** The props that will be passed directly to the <img> element. */
    imgProps?: ImgHTMLAttributes<HTMLImageElement>;
    /** Whether cross origin is enabled or not. */
    isCrossOriginEnabled?: boolean;
    /** Whether the image has to be centered according to the focal point after a window resize. */
    isFollowingWindowSize?: boolean;
    /** The size variant of the component. */
    size?: ValueOf<ThumbnailSize>;
    /** The image loading mode. */
    loading?: ValueOf<ImageLoading>;
    /** The time before recalculating focal point if isFollowingWindowSize is activated. */
    resizeDebounceTime?: number;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
    /** The variant of the component. */
    variant?: ValueOf<ThumbnailVariant>;
}

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
const DEFAULT_PROPS: Partial<ThumbnailProps> = {
    align: Alignment.left,
    aspectRatio: AspectRatio.original,
    crossOrigin: CrossOrigin.anonymous,
    fallback: mdiImageBrokenVariant,
    focusPoint: { x: 0, y: 0 },
    isCrossOriginEnabled: true,
    isFollowingWindowSize: true,
    loading: ImageLoading.lazy,
    resizeDebounceTime: 20,
    theme: Theme.light,
    variant: ThumbnailVariant.squared,
};

const Thumbnail: React.FC<ThumbnailProps> = ({
    align,
    alt = 'Thumbnail',
    aspectRatio,
    className,
    crossOrigin,
    fallback,
    fillHeight,
    focusPoint,
    image,
    imgProps,
    isCrossOriginEnabled,
    isFollowingWindowSize,
    loading,
    onClick,
    resizeDebounceTime,
    size,
    theme,
    variant,
    ...forwardedProps
}: ThumbnailProps): ReactElement => {
    const [thumbnailState, setThumbnailState] = useState<ThumbnailStates>('isLoading');
    const focusImageRef = useFocusedImage(
        focusPoint!,
        aspectRatio!,
        size!,
        resizeDebounceTime!,
        isFollowingWindowSize!,
        thumbnailState,
    );
    const setCrossOrigin = () => (!isInternetExplorer() && isCrossOriginEnabled ? crossOrigin : undefined);
    const onImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (imgProps?.onError) {
            imgProps.onError(event);
        }
        setThumbnailState('hasError');
    };
    const onImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (imgProps?.onLoad) {
            imgProps.onLoad(event);
        }
        setThumbnailState('isLoaded');
    };
    const renderedFallback = useMemo(
        () =>
            typeof fallback === 'string' ? (
                <Icon
                    className={`${CLASSNAME}__fallback`}
                    icon={fallback as string}
                    size={size || Size.m}
                    theme={theme}
                />
            ) : (
                fallback
            ),
        [fallback, size],
    );

    const renderedImage = useMemo(() => {
        const isOriginalAspectRatio = aspectRatio === AspectRatio.original;
        const imgClassname = isOriginalAspectRatio ? `${CLASSNAME}__image` : `${CLASSNAME}__focused-image`;
        const img = (
            <img
                {...(imgProps || {})}
                ref={focusImageRef}
                className={imgClassname}
                crossOrigin={setCrossOrigin() as any}
                src={image}
                alt={alt}
                loading={loading as any}
                onLoad={onImageLoad}
                onError={onImageError}
            />
        );
        return isOriginalAspectRatio ? img : <div className={`${CLASSNAME}__background`}>{img}</div>;
    }, [aspectRatio, crossOrigin, image, imgProps, onImageError, onImageLoad]);

    useEffect(() => {
        setThumbnailState('isLoading');
    }, [image, isCrossOriginEnabled, crossOrigin]);

    return (
        <div
            {...forwardedProps}
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
        >
            {thumbnailState === 'hasError' ? renderedFallback : renderedImage}
        </div>
    );
};
Thumbnail.displayName = COMPONENT_NAME;
Thumbnail.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Thumbnail, ThumbnailProps, ThumbnailSize, ThumbnailStates, ThumbnailVariant, CrossOrigin };
