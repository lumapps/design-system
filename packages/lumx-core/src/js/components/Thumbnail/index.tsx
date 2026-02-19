import type { CSSProperties, ImgHTMLAttributes } from 'react';

import { AspectRatio, HorizontalAlignment, Size } from '@lumx/core/js/constants';
import type { GenericProps, HasTheme, CommonRef, JSXElement, LumxClassName, HasClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { mdiImageBroken } from '@lumx/icons';
import { Icon } from '../Icon';
import { RawClickable } from '../RawClickable';
import { ThumbnailSize, ThumbnailVariant, ThumbnailObjectFit } from './types';

type ImgHTMLProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * Defines the props of the component.
 */
export interface ThumbnailProps extends HasTheme, HasClassName {
    /** Alignment of the thumbnail in it's parent (requires flex parent). */
    align?: HorizontalAlignment;
    /** Image alternative text. */
    alt: string;
    /** Image aspect ratio. */
    aspectRatio?: AspectRatio;
    /** Badge. */
    badge?: JSXElement;
    /** Image cross origin resource policy. */
    crossOrigin?: ImgHTMLProps['crossOrigin'];
    /** Fallback icon (SVG path) or react node when image fails to load. */
    fallback?: string | JSXElement;
    /** Whether the thumbnail should fill it's parent size (requires flex parent) or not. */
    fillHeight?: boolean;
    /** Image URL. */
    image: string;
    loadingState: string;
    /** Props to inject into the native <img> element. */
    imgProps?: ImgHTMLProps;
    /** Reference to the native <img> element. */
    imgRef?: CommonRef;
    ref?: CommonRef;
    /** Set to true to force the display of the loading skeleton. */
    isLoading?: boolean;
    /** Set how the image should fit when its aspect ratio is constrained */
    objectFit?: ThumbnailObjectFit;
    /** Size variant of the component. */
    size?: ThumbnailSize;
    /** Image loading mode. */
    loading?: 'eager' | 'lazy';
    /** Ref of an existing placeholder image to display while loading. */
    loadingPlaceholderImageRef?: React.RefObject<HTMLImageElement>;
    /** On click callback. */
    handleClick?: (event: any) => void;
    /** On key press callback. */
    handleKeyPress?: (event: any) => void;
    /** Variant of the component. */
    variant?: ThumbnailVariant;
    /** Props to pass to the link wrapping the thumbnail. */
    linkProps?: GenericProps;
    focusPointStyle?: GenericProps;
    disabledStateProps?: GenericProps;
    isAnyDisabled?: boolean;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    'aria-label'?: string;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Thumbnail';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-thumbnail';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ThumbnailProps> = {
    fallback: mdiImageBroken,
    loading: 'lazy',
};

/**
 * Thumbnail component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Thumbnail = (props: ThumbnailProps) => {
    const {
        align,
        alt,
        aspectRatio = AspectRatio.original,
        badge,
        className,
        crossOrigin,
        ref,
        fallback = DEFAULT_PROPS.fallback,
        focusPointStyle,
        fillHeight,
        image,
        imgProps,
        imgRef: propImgRef,
        isLoading: isLoadingProp,
        objectFit,
        loading = DEFAULT_PROPS.loading,
        loadingPlaceholderImageRef,
        isAnyDisabled,
        disabledStateProps,
        size,
        theme,
        loadingState,
        variant,
        linkProps,
        linkAs,
        handleClick,
        handleKeyPress,
        ...forwardedProps
    } = props;
    const isLoading = isLoadingProp || loadingState === 'isLoading';
    const hasError = loadingState === 'hasError';

    const hasIconErrorFallback = hasError && typeof fallback === 'string';
    const hasCustomErrorFallback = hasError && !hasIconErrorFallback;
    const imageErrorStyle: CSSProperties = {};
    if (hasIconErrorFallback) {
        // Keep the image layout on icon fallback.
        imageErrorStyle.visibility = 'hidden';
    } else if (hasCustomErrorFallback) {
        // Remove the image on custom fallback.
        imageErrorStyle.display = 'none';
    }

    const isLink = Boolean(linkProps?.href || linkAs);
    const isClickable = !isAnyDisabled && Boolean(isLink || !!handleClick || !!handleKeyPress);

    const wrapperProps = { ...forwardedProps };
    if (isClickable) {
        Object.assign(wrapperProps, { as: linkAs || (linkProps?.href ? 'a' : 'button') }, disabledStateProps);
        if (isLink) {
            Object.assign(wrapperProps, linkProps);
        } else {
            wrapperProps['aria-label'] = forwardedProps['aria-label'] || alt;
        }
    }

    const wrapperClassName = classNames.join(
        linkProps?.className,
        className,
        block({
            [`align-${align}`]: Boolean(align),
            [`aspect-ratio-${aspectRatio}`]: Boolean(aspectRatio),
            [`size-${size}`]: Boolean(size),
            [`theme-${theme}`]: Boolean(theme),
            [`variant-${variant}`]: Boolean(variant),
            'is-clickable': isClickable,
            'has-error': hasError,
            'has-icon-error-fallback': hasIconErrorFallback,
            'has-custom-error-fallback': hasCustomErrorFallback,
            'is-loading': isLoading,
            [`object-fit-${objectFit}`]: Boolean(objectFit),
            'has-badge': !!badge,
            'fill-height': fillHeight,
        }),
    );

    // If we have a loading placeholder image that is really loaded (complete)
    const loadingPlaceholderImage =
        (isLoading && loadingPlaceholderImageRef?.current?.complete && loadingPlaceholderImageRef?.current) ||
        undefined;

    // Set loading placeholder image as background
    const loadingStyle = loadingPlaceholderImage
        ? { backgroundImage: `url(${loadingPlaceholderImage.src})` }
        : undefined;

    const innerImage = (
        <>
            <span className={element('background')}>
                <img
                    // Use placeholder image size
                    width={loadingPlaceholderImage?.naturalWidth}
                    height={loadingPlaceholderImage?.naturalHeight}
                    {...imgProps}
                    style={{
                        // Reserve space while loading (when possible)
                        width: isLoading ? imgProps?.width || loadingPlaceholderImage?.naturalWidth : undefined,
                        ...imgProps?.style,
                        ...imageErrorStyle,
                        ...focusPointStyle,
                        ...loadingStyle,
                    }}
                    ref={propImgRef}
                    className={classNames.join(
                        element('image', {
                            'is-loading': isLoading,
                            'has-defined-size': Boolean(imgProps?.height && imgProps.width),
                        }),
                        imgProps?.className,
                    )}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore - crossOrigin prop compatibility between React and Vue JSX
                    crossOrigin={crossOrigin}
                    src={image}
                    alt={alt}
                    loading={loading}
                />
                {!isLoading && hasError && (
                    <span className={element('fallback')}>
                        {hasIconErrorFallback ? Icon({ icon: fallback as string, size: Size.xxs, theme }) : fallback}
                    </span>
                )}
            </span>
            {badge}
        </>
    );

    /** Render `RawClickable` as a function since it is a core component which needs to be treated as such */
    if (isClickable) {
        return RawClickable({
            ref,
            ...wrapperProps,
            className: wrapperClassName,
            children: innerImage as JSXElement,
            handleClick,
            handleKeyPress,
        });
    }

    return (
        <div ref={ref} {...wrapperProps} className={wrapperClassName}>
            {innerImage}
        </div>
    );
};

export * from './utils';
