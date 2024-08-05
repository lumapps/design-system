import React from 'react';

import memoize from 'lodash/memoize';

import { startViewTransition } from '@lumx/react/utils/DOM/startViewTransition';
import { findImage } from '@lumx/react/utils/DOM/findImage';

import type { ImageLightboxProps } from './types';
import { CLASSNAME } from './constants';

/** Subset of the ImageLightboxProps managed by the useImageLightbox hook */
type ManagedProps = Pick<
    ImageLightboxProps,
    'isOpen' | 'images' | 'parentElement' | 'activeImageRef' | 'onClose' | 'activeImageIndex'
>;

const EMPTY_PROPS: ManagedProps = { isOpen: false, images: [], parentElement: React.createRef() };

type TriggerOptions = Pick<ImageLightboxProps, 'activeImageIndex'>;

/**
 * Set up an ImageLightbox with images and triggers.
 *
 * - Associate a trigger with the lightbox to properly focus the trigger on close
 * - Associate a trigger with an image to display on open
 * - Automatically provide a view transition between an image trigger and the displayed image on open & close
 *
 * @param initialProps Images to display in the image lightbox
 */
export function useImageLightbox<P extends Partial<ImageLightboxProps>>(
    initialProps: P,
): {
    /**
     * Generates trigger props
     * @param index Provide an index to choose which image to display when the image lightbox opens.
     * */
    getTriggerProps: (options?: TriggerOptions) => { onClick: React.MouseEventHandler; ref: React.Ref<any> };
    /** Props to forward to the ImageLightbox */
    imageLightboxProps: ManagedProps & P;
} {
    const { images = [], ...otherProps } = initialProps;

    const imagesPropsRef = React.useRef(images);
    React.useEffect(() => {
        imagesPropsRef.current = images.map((props) => ({ imgRef: React.createRef(), ...props }));
    }, [images]);

    const currentImageRef = React.useRef<HTMLImageElement>(null);
    const [imageLightboxProps, setImageLightboxProps] = React.useState(
        () => ({ ...EMPTY_PROPS, ...otherProps }) as ManagedProps & P,
    );

    const getTriggerProps = React.useMemo(() => {
        const triggerImageRefs: Record<number, React.RefObject<HTMLImageElement>> = {};

        async function close() {
            const currentImage = currentImageRef.current;
            if (!currentImage) {
                return;
            }
            const currentIndex = imagesPropsRef.current.findIndex(
                ({ imgRef }) => (imgRef as any)?.current === currentImage,
            );

            await startViewTransition({
                changes() {
                    // Close lightbox
                    setImageLightboxProps((prevProps) => ({ ...prevProps, isOpen: false }));
                },
                // Morph from the image in lightbox to the image in trigger
                viewTransitionName: {
                    source: currentImageRef,
                    target: triggerImageRefs[currentIndex],
                    name: CLASSNAME,
                },
            });
        }

        async function open(triggerElement: HTMLElement, { activeImageIndex }: TriggerOptions = {}) {
            // If we find an image inside the trigger, animate it in transition with the opening image
            const triggerImage = triggerImageRefs[activeImageIndex as any]?.current || findImage(triggerElement);

            // Inject the trigger image as loading placeholder for better loading state
            const imagesWithFallbackSize = imagesPropsRef.current.map((image, idx) => {
                if (triggerImage && idx === activeImageIndex && !image.loadingPlaceholderImageRef) {
                    return { ...image, loadingPlaceholderImageRef: { current: triggerImage } };
                }
                return image;
            });

            await startViewTransition({
                changes: () => {
                    // Open lightbox with setup props
                    setImageLightboxProps((prevProps) => ({
                        ...prevProps,
                        activeImageRef: currentImageRef,
                        parentElement: { current: triggerElement },
                        isOpen: true,
                        onClose: () => {
                            close();
                            prevProps?.onClose?.();
                        },
                        images: imagesWithFallbackSize,
                        activeImageIndex: activeImageIndex || 0,
                    }));
                },
                // Morph from the image in trigger to the image in lightbox
                viewTransitionName: {
                    source: triggerImage,
                    target: currentImageRef,
                    name: CLASSNAME,
                },
            });
        }

        return memoize((options?: TriggerOptions) => ({
            ref(element: HTMLElement | null) {
                // Track trigger image ref if any
                if (options?.activeImageIndex !== undefined && element) {
                    triggerImageRefs[options.activeImageIndex] = { current: findImage(element) };
                }
            },
            onClick(e: React.MouseEvent) {
                open(e.target as HTMLElement, options);
            },
        }));
    }, []);

    return { getTriggerProps, imageLightboxProps };
}
