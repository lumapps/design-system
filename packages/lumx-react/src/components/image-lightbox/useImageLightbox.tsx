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
 * @param props Images to display in the image lightbox
 */
export function useImageLightbox<P extends Partial<ImageLightboxProps>>(
    props: P,
): {
    /**
     * Generates trigger props
     * @param index Provide an index to choose which image to display when the image lightbox opens.
     * */
    getTriggerProps: (options?: TriggerOptions) => { onClick: React.MouseEventHandler; ref: React.Ref<any> };
    /** Props to forward to the ImageLightbox */
    imageLightboxProps: ManagedProps & P;
} {
    const propsRef = React.useRef(props);

    React.useEffect(() => {
        propsRef.current = props;
    }, [props]);

    // Keep reference for each image elements
    const imageRefsRef = React.useRef<Array<React.RefObject<HTMLImageElement>>>([]);

    const currentImageRef = React.useRef<HTMLImageElement>(null);
    const [imageLightboxProps, setImageLightboxProps] = React.useState(
        () => ({ ...EMPTY_PROPS, ...props }) as ManagedProps & P,
    );

    const getTriggerProps = React.useMemo(() => {
        const triggerImageRefs: Record<number, React.RefObject<HTMLImageElement>> = {};

        async function close() {
            const currentImage = currentImageRef.current;
            if (!currentImage) {
                return;
            }
            const currentIndex = imageRefsRef.current.findIndex(
                (imageRef) => imageRef.current === currentImage,
            ) as number;

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

            // Inject refs to improve transition and loading style
            const images = propsRef.current?.images?.map((image, idx) => {
                // Get or create image reference
                let imgRef = imageRefsRef.current[idx];
                if (!imgRef) {
                    imgRef = React.createRef();
                    imageRefsRef.current[idx] = imgRef;
                }

                // Try to use the trigger image as the loading placeholder
                const loadingPlaceholderImageRef =
                    triggerImage && idx === activeImageIndex ? { current: triggerImage } : undefined;

                return { loadingPlaceholderImageRef, ...image, imgRef };
            });

            await startViewTransition({
                changes: () => {
                    // Open lightbox with setup props
                    setImageLightboxProps((prevProps) => ({
                        ...prevProps,
                        ...propsRef.current,
                        activeImageRef: currentImageRef,
                        parentElement: { current: triggerElement },
                        isOpen: true,
                        onClose: () => {
                            close();
                            prevProps?.onClose?.();
                        },
                        images,
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
