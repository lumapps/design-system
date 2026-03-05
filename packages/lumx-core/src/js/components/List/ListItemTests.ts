import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-list-item';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { children: 'Label', ...propsOverride };
    render(props, options);

    const listItem = getByClassName(document.body, CLASSNAME);
    const link = queryByClassName(listItem, `${CLASSNAME}__link`);
    const listItemWrapper = queryByClassName(listItem, `${CLASSNAME}__wrapper`);
    return { props, listItem, link, wrapper: listItemWrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('ListItem core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { listItem, link, wrapper: listItemWrapper } = setup({}, renderOptions);
                expect(listItem).toBeInTheDocument();
                expect(link).not.toBeInTheDocument();
                expect(listItemWrapper).toBeInTheDocument();
                expect(listItemWrapper?.tagName).toBe('DIV');
                expect(listItem).toHaveTextContent('Label');
            });

            it('should render as a button when handleClick is provided', () => {
                const { link } = setup({ handleClick: vi.fn() }, renderOptions);
                expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
                expect(link?.tagName).toBe('BUTTON');
            });

            it('should render as a link', () => {
                setup({ linkProps: { href: '#' } }, renderOptions);
                const link = screen.getByRole('link', { name: 'Label' });
                expect(link).toBeInTheDocument();
                expect(link.tagName).toBe('A');
                expect(link).toHaveAttribute('href', '#');
            });

            it('should apply size class', () => {
                const { listItem } = setup({ size: 'big' }, renderOptions);
                expect(listItem).toHaveClass(`${CLASSNAME}--size-big`);
            });

            it('should apply highlighted and selected classes to link', () => {
                const { link } = setup({ handleClick: vi.fn(), isHighlighted: true, isSelected: true }, renderOptions);
                expect(link).toHaveClass(`${CLASSNAME}__link--is-highlighted`);
                expect(link).toHaveClass(`${CLASSNAME}__link--is-selected`);
            });
        });

        describe('linkProps forwarding', () => {
            it('should forward target and rel to the link', () => {
                setup(
                    { linkProps: { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer' } },
                    renderOptions,
                );
                const link = screen.getByRole('link', { name: 'Label' });
                expect(link).toHaveAttribute('target', '_blank');
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });
    });
};
