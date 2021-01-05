import React, { forwardRef, ImgHTMLAttributes, ReactNode, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';

import { Alignment, AspectRatio, FocusPoint, Icon, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import isFunction from 'lodash/isFunction';

import { Comp, GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import { mdiImageBrokenVariant } from '@lumx/icons';
import { useFocusedImage } from '@lumx/react/hooks/useFocusedImage';
import { isInternetExplorer } from '@lumx/react/utils/isInternetExplorer';

/**
 * Loading attribute is not yet supported in typescript, so we need
 * to add it in order to avoid a ts error.
 * https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/blob/master/ADVANCED.md#adding-non-standard-attributes
 */
declare module 'react' {
    interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
        loading?: 'eager' | 'lazy';
    }
}

/**
 * All available aspect ratios.
 * @deprecated
 */
export const ThumbnailAspectRatio: Record<string, AspectRatio> = { ...AspectRatio };

/**
 *  Authorized size values.
 */
export type ThumbnailSize = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 *  Thumbnail status.
 */
export type ThumbnailStates = 'isLoading' | 'hasError' | 'isLoaded';

/**
 *  Cross-origin values.
 */
export enum CrossOrigin {
    anonymous = 'anonymous',
    useCredentials = 'use-credentials',
}

/**
 * The authorized variants.
 */
export enum ThumbnailVariant {
    squared = 'squared',
    rounded = 'rounded',
}

/**
 * Defines the props of the component.
 */
export interface ThumbnailProps extends GenericProps {
    /** The thumbnail alignment. */
    align?: Alignment.right | Alignment.center | Alignment.left;
    /** The image aspect ratio. */
    aspectRatio?: AspectRatio;
    /**
     * Allows images that are loaded from foreign origins
     * to be used as if they had been loaded from the current origin.
     */
    crossOrigin?: CrossOrigin;
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
    size?: ThumbnailSize;
    /** The image loading mode. */
    loading?: 'eager' | 'lazy';
    /** The time before recalculating focal point if isFollowingWindowSize is activated. */
    resizeDebounceTime?: number;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The component variant. */
    variant?: ThumbnailVariant;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Thumbnail`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
    loading: 'lazy',
    resizeDebounceTime: 20,
    theme: Theme.light,
    variant: ThumbnailVariant.squared,
};

/* eslint-disable jsx-a11y/no-noninteractive-tabindex,jsx-a11y/no-static-element-interactions */
/**
 * Thumbnail component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Thumbnail: Comp<ThumbnailProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
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
    } = props;
    const [thumbnailState, setThumbnailState] = useState<ThumbnailStates>('isLoading');
    const focusImageRef = useFocusedImage(
        focusPoint as FocusPoint,
        aspectRatio as AspectRatio,
        size as Size,
        resizeDebounceTime as number,
        isFollowingWindowSize as boolean,
        thumbnailState,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setCrossOrigin = () => (!isInternetExplorer() && isCrossOriginEnabled ? crossOrigin : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (imgProps?.onError) {
            imgProps.onError(event);
        }
        setThumbnailState('hasError');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        [fallback, size, theme],
    );

    const renderedImage = useMemo(() => {
        const isOriginalAspectRatio = aspectRatio === AspectRatio.original;
        const imgClassname = isOriginalAspectRatio ? `${CLASSNAME}__image` : `${CLASSNAME}__focused-image`;
        const img = (
            <img
                {...(imgProps || {})}
                ref={focusImageRef}
                className={imgClassname}
                crossOrigin={setCrossOrigin()}
                src={image}
                alt={alt}
                loading={loading}
                onLoad={onImageLoad}
                onError={onImageError}
            />
        );
        return isOriginalAspectRatio ? img : <div className={`${CLASSNAME}__background`}>{img}</div>;
    }, [alt, aspectRatio, focusImageRef, image, imgProps, loading, onImageError, onImageLoad, setCrossOrigin]);

    useEffect(() => {
        setThumbnailState('isLoading');
    }, [image, isCrossOriginEnabled, crossOrigin]);

    return (
        <div
            ref={ref}
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
});
Thumbnail.displayName = COMPONENT_NAME;
Thumbnail.className = CLASSNAME;
Thumbnail.defaultProps = DEFAULT_PROPS;
