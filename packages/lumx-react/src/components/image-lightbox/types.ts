import type { IconButtonProps, LightboxProps, SlideshowProps, ThumbnailProps } from '@lumx/react';
import type { HasClassName } from '@lumx/react/utils/type';
import type { ImageCaptionMetadata } from '@lumx/react/components/image-block/ImageCaption';

export type InheritedSlideShowProps = Pick<SlideshowProps, 'slideshowControlsProps' | 'slideGroupLabel'>;

export interface ZoomButtonProps {
    /** Zoom in button props */
    zoomInButtonProps?: IconButtonProps;
    /** Zoom out button props */
    zoomOutButtonProps?: IconButtonProps;
}

export type InheritedThumbnailProps = Pick<
    ThumbnailProps,
    'image' | 'alt' | 'imgProps' | 'imgRef' | 'loadingPlaceholderImageRef'
>;

export type InheritedImageMetadata = Pick<ImageCaptionMetadata, 'title' | 'description' | 'tags'>;

export type ImageProps = InheritedThumbnailProps & InheritedImageMetadata;

export interface ImagesProps {
    /** Index of the active image to show on open */
    activeImageIndex?: number;
    /** List of images to display */
    images: Array<ImageProps>;
    /** Ref of the active image when the lightbox is open */
    activeImageRef?: React.Ref<HTMLImageElement>;
}

export type InheritedLightboxProps = Pick<
    LightboxProps,
    'isOpen' | 'parentElement' | 'onClose' | 'closeButtonProps' | 'aria-label' | 'aria-labelledby'
>;

export type ForwardedProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * ImageLightbox component props
 */
export interface ImageLightboxProps
    extends HasClassName,
        ZoomButtonProps,
        ImagesProps,
        InheritedSlideShowProps,
        InheritedLightboxProps,
        ForwardedProps {}
