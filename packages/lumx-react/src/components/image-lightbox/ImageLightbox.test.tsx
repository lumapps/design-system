import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, within, screen, waitFor } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { useImageSize } from '@lumx/react/hooks/useImageSize';
import { useSizeOnWindowResize } from '@lumx/react/hooks/useSizeOnWindowResize';

import { ImageLightbox } from './ImageLightbox';
import { ImageLightboxProps } from './types';
import Meta, {
    MultipleImages,
    MultipleImagesWithZoom,
    SingleImage,
    SingleImageWithZoom,
    WithButtonTrigger,
    WithMosaicTrigger,
} from './ImageLightbox.stories';

vi.mock('@lumx/react/hooks/useImageSize');
vi.mock('@lumx/react/hooks/useSizeOnWindowResize');

const CLASSNAME = ImageLightbox.className as string;
const baseProps = Meta.args;

const setup = (overrides: Partial<ImageLightboxProps> = {}) => {
    const props: any = {
        ...baseProps,
        isOpen: true,
        images: [],
        ...overrides,
    };
    const result = render(<ImageLightbox {...props} />);
    const rerender = () => result.rerender(<ImageLightbox {...props} />);
    const imageLightbox = queryByClassName(document.body, CLASSNAME);
    return { props, imageLightbox, rerender };
};

const queries = {
    getImageLightbox: () => getByClassName(document.body, CLASSNAME),
    queryCloseButton: (imageLightbox: HTMLElement) => within(imageLightbox).queryByRole('button', { name: 'Close' }),
    queryImage: (imageLightbox: HTMLElement, name?: string) => within(imageLightbox).queryByRole('img', { name }),
    queryScrollArea: (imageLightbox: HTMLElement) =>
        queryByClassName(imageLightbox, 'lumx-image-lightbox__image-slide'),
    queryZoomInButton: (imageLightbox: HTMLElement) => within(imageLightbox).queryByRole('button', { name: 'Zoom in' }),
    queryZoomOutButton: (imageLightbox: HTMLElement) =>
        within(imageLightbox).queryByRole('button', { name: 'Zoom out' }),
    queryPrevSlideButton: (imageLightbox: HTMLElement) =>
        within(imageLightbox).queryByRole('button', { name: 'Previous' }),
    queryNextSlideButton: (imageLightbox: HTMLElement) => within(imageLightbox).queryByRole('button', { name: 'Next' }),
    querySlideButton: (imageLightbox: HTMLElement, slide: number) =>
        within(imageLightbox).queryByRole('tab', { name: `Go to slide ${slide}` }),
};

describe(`<${ImageLightbox.displayName}>`, () => {
    beforeEach(() => {
        (useImageSize as any).mockReturnValue(null);
        (useSizeOnWindowResize as any).mockReturnValue([null, vi.fn()]);
    });

    describe('render', () => {
        it('should render single image', () => {
            setup(SingleImage.args);
            const imageLightbox = queries.getImageLightbox();

            // Should render
            expect(queries.queryCloseButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryImage(imageLightbox, 'Image 1')).toBeInTheDocument();

            // Should not render
            expect(queries.queryZoomInButton(imageLightbox)).not.toBeInTheDocument();
            expect(queries.queryZoomOutButton(imageLightbox)).not.toBeInTheDocument();
            expect(queries.queryPrevSlideButton(imageLightbox)).not.toBeInTheDocument();
            expect(queries.queryNextSlideButton(imageLightbox)).not.toBeInTheDocument();
        });

        it('should render single image with zoom', () => {
            setup(SingleImageWithZoom.args);
            const imageLightbox = queries.getImageLightbox();

            // Should render
            expect(queries.queryCloseButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryImage(imageLightbox, 'Image 1')).toBeInTheDocument();
            expect(queries.queryZoomInButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryZoomOutButton(imageLightbox)).toBeInTheDocument();

            // Should not render
            expect(queries.queryPrevSlideButton(imageLightbox)).not.toBeInTheDocument();
            expect(queries.queryNextSlideButton(imageLightbox)).not.toBeInTheDocument();
        });

        it('should render multiple images', () => {
            setup(MultipleImages.args);
            const imageLightbox = queries.getImageLightbox();

            // Should render
            expect(queries.queryCloseButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryImage(imageLightbox, 'Image 1')).toBeInTheDocument();
            expect(queries.queryPrevSlideButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryNextSlideButton(imageLightbox)).toBeInTheDocument();

            // Should not render
            expect(queries.queryZoomInButton(imageLightbox)).not.toBeInTheDocument();
            expect(queries.queryZoomOutButton(imageLightbox)).not.toBeInTheDocument();
        });

        it('should render multiple images with set active image', () => {
            setup({ ...MultipleImages.args, activeImageIndex: 1 });
            const imageLightbox = queries.getImageLightbox();

            // Should render
            expect(queries.queryImage(imageLightbox, 'Image 2')).toBeInTheDocument();
        });

        it('should render multiple images with zoom', () => {
            setup(MultipleImagesWithZoom.args);
            const imageLightbox = queries.getImageLightbox();

            // Should render
            expect(queries.queryCloseButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryImage(imageLightbox, 'Image 1')).toBeInTheDocument();
            expect(queries.queryPrevSlideButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryNextSlideButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryZoomInButton(imageLightbox)).toBeInTheDocument();
            expect(queries.queryZoomOutButton(imageLightbox)).toBeInTheDocument();
        });
    });

    describe('trigger', () => {
        it('should move focus on open and close with single image lightbox', async () => {
            const decorator = WithButtonTrigger.decorators[0];
            const Story = ({ args }: any) => <ImageLightbox {...args} />;
            const Render = () => decorator(Story, { args: baseProps });
            render(<Render />);

            // Focus the second button
            await userEvent.tab();
            await userEvent.tab();
            const buttonTrigger = screen.getByRole('button', { name: 'Image 2' });
            expect(buttonTrigger).toHaveFocus();

            // Open image lightbox with the button trigger
            await userEvent.keyboard('{enter}');

            // Focus moved to the close button
            const imageLightbox = queries.getImageLightbox();
            const closeButton = queries.queryCloseButton(imageLightbox);
            expect(closeButton).toHaveFocus();
            const tooltip = screen.getByRole('tooltip', { name: 'Close' });
            expect(tooltip).toBeInTheDocument();

            // Image lightbox opened on the correct image
            expect(queries.queryImage(imageLightbox, 'Image 2')).toBeInTheDocument();

            // Close tooltip
            await userEvent.keyboard('{escape}');
            expect(tooltip).not.toBeInTheDocument();

            // Close on escape
            await userEvent.keyboard('{escape}');
            await waitFor(() => {
                expect(imageLightbox).not.toBeInTheDocument();
            });

            // Focus moved back to the trigger button
            expect(buttonTrigger).toHaveFocus();
        });

        it('should move focus on open and close with multiple image lightbox', async () => {
            const decorator = WithMosaicTrigger.decorators[0];
            const Story = ({ args }: any) => <ImageLightbox {...args} />;
            const Render = () => decorator(Story, { args: { ...baseProps, ...WithMosaicTrigger.args } });
            render(<Render />);

            // Focus the first button & activate to open
            await userEvent.tab();
            const buttonTrigger = document.activeElement;
            await userEvent.keyboard('{enter}');

            // Focus moved to the first slide button
            const imageLightbox = queries.getImageLightbox();
            expect(queries.querySlideButton(imageLightbox, 1)).toHaveFocus();

            // Image lightbox opened on the correct image
            expect(queries.queryImage(imageLightbox, 'Image 1')).toBeInTheDocument();

            // Close on escape
            await userEvent.keyboard('{escape}');
            await waitFor(() => {
                expect(imageLightbox).not.toBeInTheDocument();
            });

            // Focus moved back to the trigger button
            expect(buttonTrigger).toHaveFocus();
        });
    });

    describe('zoom', () => {
        const scrollAreaSize = { width: 600, height: 600 };
        beforeEach(() => {
            (useImageSize as any).mockImplementation((_: any, getInitialSize: any) => getInitialSize?.() || null);
            (useSizeOnWindowResize as any).mockReturnValue([scrollAreaSize, vi.fn()]);
        });

        it('should use the image initial size', () => {
            setup({
                images: [
                    { image: 'https://example.com/image.png', alt: 'Image 1', imgProps: { width: 200, height: 200 } },
                ],
            });
            const imageLightbox = queries.getImageLightbox();
            const image = queries.queryImage(imageLightbox, 'Image 1');
            expect(image).toHaveStyle({
                height: `200px`,
                width: `200px`,
            });
        });

        it('should zoom on zoom button pressed', async () => {
            // Set image size (simulate image loaded)
            const imageSize = { width: 500, height: 300 };
            (useImageSize as any).mockReturnValue(imageSize);

            setup(SingleImageWithZoom.args);
            const imageLightbox = queries.getImageLightbox();

            // Image style
            const image = queries.queryImage(imageLightbox, 'Image 1');
            expect(image).toHaveStyle({ width: `${imageSize.width}px`, height: `${imageSize.height}px` });

            // Scroll area is bigger than the image, it should not be focusable
            expect(queries.queryScrollArea(imageLightbox)).not.toHaveAttribute('tabindex');

            // Zoom in
            const zoomInButton = queries.queryZoomInButton(imageLightbox) as any;
            await userEvent.click(zoomInButton);
            expect(image).toHaveStyle({ height: '450px', width: '750px' });

            // Scroll area is smaller than the image, it should be focusable
            expect(queries.queryScrollArea(imageLightbox)).toHaveAttribute('tabindex', '0');

            // Zoom out
            const zoomOutButton = queries.queryZoomOutButton(imageLightbox) as any;
            await userEvent.click(zoomOutButton);
            expect(image).toHaveStyle({ width: `${imageSize.width}px`, height: `${imageSize.height}px` });
        });
    });

    describe('Props & Interactions', () => {
        it('should forward closeButtonProps', () => {
            setup({ ...SingleImage.args, closeButtonProps: { label: 'Custom Close' } as any });
            const imageLightbox = queries.getImageLightbox();
            expect(within(imageLightbox).getByRole('button', { name: 'Custom Close' })).toBeInTheDocument();
        });

        it('should change slide on pagination click', async () => {
            setup(MultipleImages.args);
            const imageLightbox = queries.getImageLightbox();

            // Initial state
            expect(queries.queryImage(imageLightbox, 'Image 1')).toBeInTheDocument();

            // Click slide 2
            const slide2 = queries.querySlideButton(imageLightbox, 2);
            await userEvent.click(slide2 as any);

            expect(queries.queryImage(imageLightbox, 'Image 2')).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'imageLightbox',
        forwardAttributes: 'imageLightbox',
    });
});
