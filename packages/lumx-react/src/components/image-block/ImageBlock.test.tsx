import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { render, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { toNestedProps } from '@lumx/react/stories/decorators/withNestedProps';

import { Alignment, Size, Thumbnail } from '@lumx/react';
import { ImageBlock, ImageBlockProps, ImageBlockCaptionPosition } from './ImageBlock';
import { FullFeatured } from './ImageBlock.stories';

const CLASSNAME = ImageBlock.className as string;

const setup = (props: Partial<ImageBlockProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<ImageBlock {...(props as any)} />, { wrapper });
    const imageBlock = queryByClassName(document.body, CLASSNAME);
    const thumbnail = queryByClassName(imageBlock as any, Thumbnail.className as string);
    return { props, imageBlock, thumbnail };
};

describe(`<${ImageBlock.displayName}>`, () => {
    it('should render caption elements', () => {
        const props = {
            ...toNestedProps(FullFeatured.args),
            titleProps: { className: 'custom-title-class' },
            descriptionProps: { className: 'custom-description-class' },
        };
        const { imageBlock } = setup(props);
        const wrapper = queryByClassName(imageBlock as HTMLElement, 'lumx-image-block__wrapper');
        expect(wrapper).toBeInTheDocument();

        const caption = queryByClassName(wrapper as HTMLElement, 'lumx-image-block__caption');
        expect(caption).toBeInTheDocument();

        const title = queryByClassName(caption as HTMLElement, 'lumx-image-block__title');
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass(props.titleProps.className);

        const description = queryByClassName(caption as HTMLElement, 'lumx-image-block__description');
        expect(description).toBeInTheDocument();
        expect(description).toHaveClass(props.descriptionProps.className);

        const tags = queryByClassName(wrapper as HTMLElement, 'lumx-image-block__tags');
        expect(tags).toBeInTheDocument();
    });

    describe('Props', () => {
        it('should apply align class', () => {
            const { imageBlock } = setup({ align: Alignment.right });
            expect(imageBlock).toHaveClass(`${CLASSNAME}--align-right`);
        });

        it('should apply size class', () => {
            const { imageBlock } = setup({ size: Size.xl });
            expect(imageBlock).toHaveClass(`${CLASSNAME}--size-xl`);
        });

        it('should apply fillHeight class', () => {
            const { imageBlock } = setup({ fillHeight: true });
            expect(imageBlock).toHaveClass(`${CLASSNAME}--fill-height`);
        });

        it('should apply caption position class', () => {
            const { imageBlock } = setup({ captionPosition: ImageBlockCaptionPosition.over });
            expect(imageBlock).toHaveClass(`${CLASSNAME}--caption-position-over`);
        });

        it('should render actions', () => {
            setup({ actions: <button type="submit">Action</button> });
            expect(screen.getByText('Action')).toBeInTheDocument();
            expect(screen.getByText('Action').parentElement).toHaveClass(`${CLASSNAME}__actions`);
        });

        it('should render image with alt text', () => {
            const { thumbnail } = setup({ alt: 'Image Alt' });
            const img = thumbnail?.querySelector('img');
            expect(img).toHaveAttribute('alt', 'Image Alt');
        });

        it('should forward thumbnail props', () => {
            const { thumbnail } = setup({ thumbnailProps: { 'data-testid': 'custom-thumb' } as any });
            const imgWrapper = thumbnail;
            // Thumbnail component passes props to root wrapper usually
            expect(imgWrapper).toHaveAttribute('data-testid', 'custom-thumb');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'imageBlock',
        forwardAttributes: 'imageBlock',
        applyTheme: {
            affects: [{ element: 'imageBlock' }, { element: 'thumbnail' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
