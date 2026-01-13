import { IMAGES } from '@lumx/core/stories/controls/image';
import { Button, Mosaic, ImageLightbox, ImageLightboxProps, Chip, ChipGroup } from '@lumx/react';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

const ZOOM_PROPS = {
    zoomInButtonProps: { label: 'Zoom in' },
    zoomOutButtonProps: { label: 'Zoom out' },
};

const SLIDESHOW_PROPS = {
    slideshowControlsProps: {
        nextButtonProps: { label: 'Next' },
        previousButtonProps: { label: 'Previous' },
        paginationItemProps: (index: number) => ({ label: `Go to slide ${index + 1}` }),
    },
};

const MULTIPLE_IMAGES: ImageLightboxProps['images'] = [
    {
        image: 'https://picsum.photos/id/237/2000/3000',
        alt: 'Image 1',
        title: 'Little puppy',
        description: 'A black labrador puppy with big brown eyes, looking up with a curious and innocent expression.',
        tags: (
            <ChipGroup>
                <Chip size="s">Tag 1</Chip>
                <Chip size="s">Tag 2</Chip>
            </ChipGroup>
        ),
    },
    {
        image: 'https://picsum.photos/id/337/3000/1000',
        alt: 'Image 2',
        // Intentionally using the wrong size to see how it renders while loading the image
        imgProps: { width: '300px', height: '100px' },
    },
    {
        image: 'https://picsum.photos/id/437/2000/2000',
        alt: 'Image 3',
    },
    {
        image: 'https://picsum.photos/id/537/300/400',
        alt: 'Image 4',
    },
    {
        image: 'https://picsum.photos/id/637/400/200',
        alt: 'Image 5',
    },
    {
        image: 'https://picsum.photos/id/737/300/300',
        alt: 'Image 6',
    },
];

export default {
    title: 'LumX components/image-lightbox/ImageLightbox',
    component: ImageLightbox,
    args: {
        closeButtonProps: { label: 'Close' },
    },
    argTypes: {
        onClose: { action: true },
    },
};

/**
 * Display a single image fullscreen in the ImageLightbox
 */
export const SingleImage = {
    args: {
        images: [{ image: IMAGES.portrait1s200, alt: 'Image 1' }],
        isOpen: true,
    },
};

/**
 * Display a single image fullscreen in the ImageLightbox with zoom controls
 */
export const SingleImageWithZoom = {
    ...SingleImage,
    args: { ...SingleImage.args, ...ZOOM_PROPS },
};

/**
 * Display a single image fullscreen in the ImageLightbox with metadata (title, description, etc.)
 */
export const SingleImageWithMetadata = {
    ...SingleImage,
    args: { ...SingleImage.args, images: [MULTIPLE_IMAGES[0]] },
};

/**
 * Display a multiple image fullscreen in the ImageLightbox
 */
export const MultipleImages = {
    args: {
        images: MULTIPLE_IMAGES,
        isOpen: true,
        ...SLIDESHOW_PROPS,
    },
};

/**
 * Display a multiple images fullscreen in the ImageLightbox with zoom controls
 */
export const MultipleImagesWithZoom = {
    ...MultipleImages,
    args: { ...MultipleImages.args, ...ZOOM_PROPS },
};

/**
 * Open ImageLightbox via buttons
 */
export const WithButtonTrigger = {
    decorators: [
        (Story: any, { args }: any) => {
            const { getTriggerProps, imageLightboxProps } = ImageLightbox.useImageLightbox({
                images: [
                    { image: IMAGES.portrait1s200, alt: 'Image 1' },
                    { image: IMAGES.landscape1s200, alt: 'Image 2' },
                ],
            });
            return (
                <>
                    <Story args={{ ...args, ...imageLightboxProps }} />
                    <Button {...(getTriggerProps({ activeImageIndex: 0 }) as any)}>Image 1</Button>
                    <Button {...(getTriggerProps({ activeImageIndex: 1 }) as any)}>Image 2</Button>
                </>
            );
        },
    ],
    // Disables Chromatic snapshot (not relevant for this story).
    parameters: { chromatic: { disable: true } },
};

/**
 * Open ImageLightbox with zoom and slideshow via clickable thumbnails in a Mosaic
 */
export const WithMosaicTrigger = {
    args: { ...SLIDESHOW_PROPS, ...ZOOM_PROPS },
    decorators: [
        (Story: any, { args }: any) => {
            const { getTriggerProps, imageLightboxProps } = ImageLightbox.useImageLightbox({ images: MULTIPLE_IMAGES });
            return (
                <>
                    <Story args={{ ...args, ...imageLightboxProps }} />
                    <Mosaic
                        thumbnails={MULTIPLE_IMAGES.map((image, index) => ({
                            ...image,
                            ...getTriggerProps({ activeImageIndex: index }),
                        }))}
                    />
                </>
            );
        },
        withWrapper({ style: { width: 300 } }),
    ],
    // Disables Chromatic snapshot (not relevant for this story).
    parameters: { chromatic: { disable: true } },
};
