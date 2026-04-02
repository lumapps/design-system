import { getByClassName, queryAllByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { Size, Theme } from '../../constants';

const CLASSNAME = 'lumx-link-preview';
const THUMBNAIL_CLASSNAME = 'lumx-thumbnail';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { link: '', ...propsOverride };
    const wrapper = render(props, options);

    const linkPreview = getByClassName(document.body, CLASSNAME);
    const thumbnail = queryByClassName(linkPreview, THUMBNAIL_CLASSNAME);
    const title = queryByClassName(linkPreview, `${CLASSNAME}__title`);
    const description = queryByClassName(linkPreview, `${CLASSNAME}__description`);
    const link = queryAllByClassName(linkPreview, `${CLASSNAME}__link`)?.[1];

    return { props, linkPreview, thumbnail, title, description, link, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('LinkPreview core tests', () => {
        it('should render with default props', () => {
            const { linkPreview, thumbnail, title, link, description } = setup({}, renderOptions);

            expect(linkPreview).toHaveClass(CLASSNAME);
            expect(linkPreview).toHaveClass(`${CLASSNAME}--size-regular`);
            expect(linkPreview).toHaveClass(`${CLASSNAME}--theme-light`);

            expect(thumbnail).not.toBeInTheDocument();
            expect(title).not.toBeInTheDocument();
            expect(link).toBeInTheDocument();
            expect(link).not.toHaveAttribute('tabindex');
            expect(description).not.toBeInTheDocument();
        });

        it('should render with only the title', () => {
            const { props, title, link } = setup({ title: 'Title', link: 'https://example.com' }, renderOptions);

            expect(title).toBe(screen.queryByRole('heading', { name: props.title }));
            const titleLink = title?.querySelector('a');
            expect(titleLink).toBeInTheDocument();
            expect(titleLink).toHaveAttribute('href', props.link);

            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('tabindex', '-1');
        });

        it('should render with complete props', () => {
            const { linkPreview, thumbnail, title, link, description, props } = setup(
                {
                    size: Size.big,
                    theme: Theme.dark,
                    thumbnailProps: { image: 'https://example.com/thumbnail.jpg', alt: '' },
                    link: 'https://example.com',
                    linkProps: { 'data-custom-attr': 'true' },
                    title: 'Title',
                    description: 'Description',
                },
                renderOptions,
            );

            const validateLink = (linkElement: any) => {
                expect(linkElement).toHaveAttribute('href', props.link);
                expect(linkElement).toHaveAttribute('data-custom-attr', 'true');
            };

            expect(linkPreview).toBeInTheDocument();
            expect(linkPreview).toHaveClass(`${CLASSNAME}--size-big`);
            expect(linkPreview).toHaveClass(`${CLASSNAME}--theme-dark`);

            expect(thumbnail).toBeInTheDocument();
            validateLink(thumbnail);

            expect(title).toHaveTextContent(props.title);
            validateLink(title?.querySelector('a'));

            expect(link).toHaveTextContent(props.link);
            validateLink(link);

            expect(description).toHaveTextContent(props.description);
        });

        describe('Props', () => {
            it('should render custom titleHeading', () => {
                const { title } = setup({ title: 'Title', titleHeading: 'h3' }, renderOptions);
                expect(title?.tagName).toBe('H3');
            });

            it('should render regular size by default', () => {
                const { linkPreview } = setup({}, renderOptions);
                expect(linkPreview).toHaveClass(`${CLASSNAME}--size-regular`);
            });

            it('should render big size when big and thumbnail provided', () => {
                const { linkPreview } = setup({ size: Size.big, thumbnailProps: { image: 'test.jpg' } }, renderOptions);
                expect(linkPreview).toHaveClass(`${CLASSNAME}--size-big`);
            });
        });
    });
};
