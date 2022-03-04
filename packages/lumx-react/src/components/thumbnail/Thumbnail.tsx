import React, {
    CSSProperties,
    forwardRef,
    ImgHTMLAttributes,
    KeyboardEventHandler,
    MouseEventHandler,
    ReactElement,
    ReactNode,
    Ref,
    useState,
} from 'react';
import classNames from 'classnames';

import { AspectRatio, HorizontalAlignment, Icon, Size, Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { mdiImageBroken } from '@lumx/icons';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useImageLoad } from '@lumx/react/components/thumbnail/useImageLoad';
import { useFocusPointStyle } from '@lumx/react/components/thumbnail/useFocusPointStyle';
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
    /** Set to true to force the display of the loading skeleton. */
    isLoading?: boolean;
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
    /** Props to pass to the link wrapping the thumbnail. */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
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
    fallback: mdiImageBroken,
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
        aspectRatio = AspectRatio.original,
        badge,
        className,
        crossOrigin,
        fallback,
        fillHeight,
        // `focusPoint` needs to be here to remove it from `forwardedProps`.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        focusPoint,
        image,
        imgProps,
        imgRef: propImgRef,
        isLoading: isLoadingProp,
        loading,
        size,
        theme,
        variant,
        linkProps,
        linkAs,
        ...forwardedProps
    } = props;
    const [imgElement, setImgElement] = useState<HTMLImageElement>();

    // Image loading state.
    const loadingState = useImageLoad(image, imgElement);
    const isLoaded = loadingState === 'isLoaded';
    const isLoading = isLoadingProp || loadingState === 'isLoading';
    const hasError = loadingState === 'hasError';

    // Focus point.
    const focusPointStyle = useFocusPointStyle(props, imgElement, isLoaded);

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
    const isButton = !!forwardedProps.onClick;
    const isClickable = isButton || isLink;

    let Wrapper: any = 'div';
    const wrapperProps = { ...forwardedProps };
    if (isLink) {
        Wrapper = linkAs || 'a';
        Object.assign(wrapperProps, linkProps);
    } else if (isButton) {
        Wrapper = 'button';
        wrapperProps.type = forwardedProps.type || 'button';
        wrapperProps['aria-label'] = forwardedProps['aria-label'] || alt;
    }

    return (
        <Wrapper
            {...wrapperProps}
            ref={ref}
            className={classNames(
                linkProps?.className,
                className,
                handleBasicClasses({
                    align,
                    aspectRatio,
                    prefix: CLASSNAME,
                    size,
                    theme,
                    variant,
                    isClickable,
                    hasError,
                    hasIconErrorFallback,
                    hasCustomErrorFallback,
                    isLoading,
                    hasBadge: !!badge,
                }),
                fillHeight && `${CLASSNAME}--fill-height`,
            )}
        >
            <div className={`${CLASSNAME}__background`}>
                <img
                    {...imgProps}
                    style={{
                        ...imgProps?.style,
                        ...imageErrorStyle,
                        ...focusPointStyle,
                    }}
                    ref={mergeRefs(setImgElement, propImgRef)}
                    className={classNames(
                        handleBasicClasses({
                            prefix: `${CLASSNAME}__image`,
                            isLoading,
                            hasDefinedSize: Boolean(imgProps?.height && imgProps.width),
                        }),
                        imgProps?.className,
                    )}
                    crossOrigin={crossOrigin}
                    src={image}
                    alt={alt}
                    loading={loading}
                />
                {!isLoading && hasError && (
                    <div className={`${CLASSNAME}__fallback`}>
                        {hasIconErrorFallback ? (
                            <Icon icon={fallback as string} size={Size.xxs} theme={theme} />
                        ) : (
                            fallback
                        )}
                    </div>
                )}
            </div>
            {badge &&
                React.cloneElement(badge, { className: classNames(`${CLASSNAME}__badge`, badge.props.className) })}
        </Wrapper>
    );
});
Thumbnail.displayName = COMPONENT_NAME;
Thumbnail.className = CLASSNAME;
Thumbnail.defaultProps = DEFAULT_PROPS;
