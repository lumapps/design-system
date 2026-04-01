import { h } from 'vue';
import { render, screen } from '@testing-library/vue';
import { queryByClassName } from '@lumx/core/testing/queries';
import ImageCaption from './ImageCaption';

const BASE_CLASS = 'lumx-image-block';

const setup = (props: Record<string, any> = {}) => {
    const { container } = render(ImageCaption, { props: { baseClassName: BASE_CLASS, ...props } });
    const wrapper = queryByClassName(container as HTMLElement, `${BASE_CLASS}__wrapper`);
    return { container, wrapper };
};

describe('<ImageCaption>', () => {
    it('should render nothing when no content is provided', () => {
        const { wrapper } = setup();
        expect(wrapper).toBeNull();
    });

    it('should render when title is provided', () => {
        const { wrapper } = setup({ title: 'My Title' });
        expect(wrapper).toBeInTheDocument();
        expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('should render when description is provided', () => {
        const { wrapper } = setup({ description: 'My Description' });
        expect(wrapper).toBeInTheDocument();
        expect(screen.getByText('My Description')).toBeInTheDocument();
    });

    it('should render when tags are provided', () => {
        const { wrapper } = setup({ tags: h('span', {}, 'Tag 1') });
        expect(wrapper).toBeInTheDocument();
        expect(screen.getByText('Tag 1')).toBeInTheDocument();
    });

    describe('caption elements', () => {
        it('should render title element with correct class', () => {
            const { wrapper } = setup({ title: 'My Title' });
            const caption = queryByClassName(wrapper as HTMLElement, `${BASE_CLASS}__caption`);
            const title = queryByClassName(caption as HTMLElement, `${BASE_CLASS}__title`);
            expect(title).toBeInTheDocument();
            expect(title).toHaveTextContent('My Title');
        });

        it('should render description element with correct class', () => {
            const { wrapper } = setup({ description: 'My Description' });
            const caption = queryByClassName(wrapper as HTMLElement, `${BASE_CLASS}__caption`);
            const description = queryByClassName(caption as HTMLElement, `${BASE_CLASS}__description`);
            expect(description).toBeInTheDocument();
            expect(description).toHaveTextContent('My Description');
        });

        it('should render tags element with correct class', () => {
            const { wrapper } = setup({ tags: h('span', {}, 'Tag') });
            const tags = queryByClassName(wrapper as HTMLElement, `${BASE_CLASS}__tags`);
            expect(tags).toBeInTheDocument();
        });
    });

    describe('Props', () => {
        it('should forward titleProps className', () => {
            const { wrapper } = setup({ title: 'My Title', titleProps: { className: 'custom-title' } });
            const caption = queryByClassName(wrapper as HTMLElement, `${BASE_CLASS}__caption`);
            const title = queryByClassName(caption as HTMLElement, `${BASE_CLASS}__title`);
            expect(title).toHaveClass('custom-title');
        });

        it('should forward descriptionProps className', () => {
            const { wrapper } = setup({
                description: 'My Description',
                descriptionProps: { className: 'custom-description' },
            });
            const caption = queryByClassName(wrapper as HTMLElement, `${BASE_CLASS}__caption`);
            const description = queryByClassName(caption as HTMLElement, `${BASE_CLASS}__description`);
            expect(description).toHaveClass('custom-description');
        });

        it('should apply captionStyle to wrapper', () => {
            const captionStyle = { maxWidth: '400px' };
            const { wrapper } = setup({ title: 'My Title', captionStyle });
            expect(wrapper).toHaveStyle({ maxWidth: '400px' });
        });

        it('should render as figcaption by default', () => {
            const { wrapper } = setup({ title: 'My Title' });
            expect(wrapper?.tagName.toLowerCase()).toBe('figcaption');
        });

        it('should render as div when as="div"', () => {
            const { wrapper } = setup({ title: 'My Title', as: 'div' });
            expect(wrapper?.tagName.toLowerCase()).toBe('div');
        });
    });
});
