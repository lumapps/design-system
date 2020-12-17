import React, {
    forwardRef,
    HTMLProps,
    ImgHTMLAttributes,
    MouseEventHandler,
    ReactNode,
    Ref,
    useRef,
    useState,
} from 'react';
import classNames from 'classnames';

import { AspectRatio, HorizontalAlignment, Icon, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { mdiImageBrokenVariant } from '@lumx/icons';
import { isInternetExplorer } from '@lumx/react/utils/isInternetExplorer';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useFocusPoint } from '@lumx/react/components/thumbnail/useFocusPoint';
import { useImageLoad } from '@lumx/react/components/thumbnail/useImageLoad';
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
    /** Image cross origin resource policy. */
    crossOrigin?: ImgHTMLProps['crossOrigin'];
    /** Fallback icon (SVG path) or react node when image fails to load. */
    fallback?: string | ReactNode;
    /** Make the thumbnail fill it's parent size (requires flex parent). */
    fillHeight?: boolean;
    /** Focus image on relative coordinates. */
    focusPoint?: FocusPoint;
    /** Image URL. */
    image: string;
    /** Props to inject into the native <img> element. */
    imgProps?: ImgHTMLProps;
    /** Reference of the native <img> element. */
    imgRef?: Ref<HTMLImageElement>;
    /** Callback on mouse click. */
    onClick?: MouseEventHandler;
    /** Size variant of the component. */
    size?: ThumbnailSize;
    /** Image loading mode. */
    loading?: ImgHTMLProps['loading'];
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Variant of the component. */
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
        className,
        crossOrigin,
        fallback,
        fillHeight,
        focusPoint,
        image,
        imgProps,
        imgRef: propImgRef,
        loading,
        onClick,
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

    // Update img style according to focus point and aspect ratio.
    const style = useFocusPoint({ focusPoint, aspectRatio, imgRef, loadingState, fillHeight });

    const [wrapper, setWrapper] = useState<HTMLElement>();
    const wrapperProps: any = {
        ...forwardedProps,
        ref: mergeRefs(setWrapper, ref),
        className: classNames(
            className,
            handleBasicClasses({ align, aspectRatio, prefix: CLASSNAME, size, theme, variant }),
            isLoading && wrapper?.getBoundingClientRect()?.height && 'lumx-color-background-dark-L6',
            fillHeight && `${CLASSNAME}--fill-height`,
        ),
    };

    // Handle clickable Thumbnail a11y.
    const Wrapper = onClick ? 'button' : 'div';
    if (onClick) {
        Object.assign(wrapperProps, { tabIndex: 0, onClick, type: 'button' } as HTMLProps<HTMLButtonElement>);
    }

    return (
        <Wrapper {...wrapperProps}>
            <div className={`${CLASSNAME}__background`} style={style?.wrapper}>
                <img
                    {...(imgProps || {})}
                    style={{
                        ...imgProps?.style,
                        ...style?.image,
                        // Remove from layout if image not loaded correctly (use fallback)
                        display: hasError ? 'none' : undefined,
                        // Hide while loading.
                        visibility: isLoading ? 'hidden' : undefined,
                    }}
                    ref={mergeRefs(imgRef, propImgRef)}
                    className={style?.image ? `${CLASSNAME}__focused-image` : `${CLASSNAME}__image`}
                    crossOrigin={crossOrigin && !isInternetExplorer() ? crossOrigin : undefined}
                    src={image}
                    alt={alt}
                    loading={loading}
                />
                {hasError &&
                    (typeof fallback === 'string' ? (
                        <Icon
                            className={`${CLASSNAME}__fallback`}
                            icon={fallback}
                            size={size || Size.m}
                            theme={theme}
                        />
                    ) : (
                        <div className={`${CLASSNAME}__fallback`}>{fallback}</div>
                    ))}
            </div>
        </Wrapper>
    );
});
Thumbnail.displayName = COMPONENT_NAME;
Thumbnail.className = CLASSNAME;
Thumbnail.defaultProps = DEFAULT_PROPS;
