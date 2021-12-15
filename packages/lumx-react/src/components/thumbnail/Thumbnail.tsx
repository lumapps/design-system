import React, {
    forwardRef,
    ImgHTMLAttributes,
    KeyboardEventHandler,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    Ref,
    useRef,
    useState,
} from 'react';
import classNames from 'classnames';

import { AspectRatio, HorizontalAlignment, Icon, Size, Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { mdiImageBrokenVariant } from '@lumx/icons';
import { isInternetExplorer } from '@lumx/react/utils/isInternetExplorer';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useFocusPoint } from '@lumx/react/components/thumbnail/useFocusPoint';
import { useImageLoad } from '@lumx/react/components/thumbnail/useImageLoad';
import { useClickable } from '@lumx/react/components/thumbnail/useClickable';
import { FocusPoint, ThumbnailSize, ThumbnailVariant } from './types';

type ImgHTMLProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * Defines the props of the component.
 */
export interface ThumbnailProps extends GenericProps {
    /** Alignment of the thumbnail in it's parent (requires flex parent). */
    align?: HorizontalAlignment;
    /** Image alternative text. */
    alt: string;
    /** Image aspect ratio. */
    aspectRatio?: AspectRatio;
    /** Badge. */
    badge?: ReactElement;
    /** Image cross origin resource policy. */
    crossOrigin?: ImgHTMLProps['crossOrigin'];
    /** Fallback icon (SVG path) or react node when image fails to load. */
    fallback?: string | ReactNode;
    /** Whether the thumbnail should fill it's parent size (requires flex parent) or not. */
    fillHeight?: boolean;
    /** Apply relative vertical and horizontal shift (from -1 to 1) on the image position inside the thumbnail. */
    focusPoint?: FocusPoint;
    /** Image URL. */
    image: string;
    /** Props to inject into the native <img> element. */
    imgProps?: ImgHTMLProps;
    /** Reference to the native <img> element. */
    imgRef?: Ref<HTMLImageElement>;
    /** Size variant of the component. */
    size?: ThumbnailSize;
    /** Image loading mode. */
    loading?: ImgHTMLProps['loading'];
    /** On click callback. */
    onClick?: MouseEventHandler<HTMLDivElement>;
    /** On key press callback. */
    onKeyPress?: KeyboardEventHandler<HTMLDivElement>;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Variant of the component. */
    variant?: ThumbnailVariant;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Thumbnail';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ThumbnailProps> = {
    fallback: mdiImageBrokenVariant,
    loading: 'lazy',
    theme: Theme.light,
};

/**
 * Thumbnail component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Thumbnail: Comp<ThumbnailProps> = forwardRef((props, ref) => {
    const {
        align,
        alt,
        aspectRatio,
        badge,
        className,
        crossOrigin,
        fallback,
        fillHeight,
        focusPoint,
        image,
        imgProps,
        imgRef: propImgRef,
        loading,
        size,
        theme,
        variant,
        ...forwardedProps
    } = props;
    const imgRef = useRef<HTMLImageElement>(null);

    // Image loading state.
    const loadingState = useImageLoad(imgRef);
    const hasError = loadingState === 'hasError';
    const isLoading = loadingState === 'isLoading';

    const [wrapper, setWrapper] = useState<HTMLElement>();
    const wrapperProps: any = {
        ...forwardedProps,
        ref: mergeRefs(setWrapper, ref),
        className: classNames(
            className,
            handleBasicClasses({ align, aspectRatio, prefix: CLASSNAME, size, theme, variant, hasBadge: !!badge }),
            isLoading && wrapper?.getBoundingClientRect()?.height && 'lumx-color-background-dark-L6',
            fillHeight && `${CLASSNAME}--fill-height`,
        ),
        // Handle clickable Thumbnail a11y.
        ...useClickable(props),
    };

    // Update img style according to focus point and aspect ratio.
    const style = useFocusPoint({ image, focusPoint, aspectRatio, imgRef, loadingState, wrapper });

    return (
        <div {...wrapperProps}>
            <div
                className={`${CLASSNAME}__background`}
                style={{
                    ...style?.wrapper,
                    // Remove from layout if image not loaded correctly (use fallback)
                    display: hasError ? 'none' : undefined,
                    // Hide while loading.
                    visibility: isLoading ? 'hidden' : undefined,
                }}
            >
                <img
                    {...imgProps}
                    style={{
                        ...imgProps?.style,
                        ...style?.image,
                    }}
                    ref={mergeRefs(imgRef, propImgRef)}
                    className={style?.image ? `${CLASSNAME}__focused-image` : `${CLASSNAME}__image`}
                    crossOrigin={crossOrigin && !isInternetExplorer() ? crossOrigin : undefined}
                    src={image}
                    alt={alt}
                    loading={loading}
                />
            </div>
            {hasError &&
                (typeof fallback === 'string' ? (
                    <Icon className={`${CLASSNAME}__fallback`} icon={fallback} size={size || Size.m} theme={theme} />
                ) : (
                    <div className={`${CLASSNAME}__fallback`}>{fallback}</div>
                ))}
            {badge &&
                React.cloneElement(badge, { className: classNames(`${CLASSNAME}__badge`, badge.props.className) })}
        </div>
    );
});
Thumbnail.displayName = COMPONENT_NAME;
Thumbnail.className = CLASSNAME;
Thumbnail.defaultProps = DEFAULT_PROPS;
