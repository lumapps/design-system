import userEvent from '@testing-library/user-event';

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

        describe('Click handling', () => {
            it('should call handleClick when button is clicked', async () => {
                const handleClick = vi.fn();
                setup({ handleClick }, renderOptions);
                await userEvent.click(screen.getByRole('button', { name: 'Label' }));
                expect(handleClick).toHaveBeenCalledTimes(1);
            });

            it('should call handleClick when link is clicked', async () => {
                const handleClick = vi.fn();
                setup({ handleClick, linkProps: { href: '#' } }, renderOptions);
                await userEvent.click(screen.getByRole('link', { name: 'Label' }));
                expect(handleClick).toHaveBeenCalledTimes(1);
            });
        });

        describe('Disabled state', () => {
            it('should render isDisabled button with aria-disabled', () => {
                const { link } = setup({ isDisabled: true, handleClick: vi.fn() }, renderOptions);
                expect(link).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not call handleClick when button is disabled', async () => {
                const handleClick = vi.fn();
                const { link } = setup({ isDisabled: true, handleClick }, renderOptions);
                if (link) await userEvent.click(link);
                expect(handleClick).not.toHaveBeenCalled();
            });

            it('should render isDisabled link with aria-disabled', () => {
                setup({ isDisabled: true, linkProps: { href: 'https://example.com' } }, renderOptions);
                const link = screen.getByRole('link', { name: 'Label' });
                expect(link).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not call handleClick when link is disabled', async () => {
                const handleClick = vi.fn();
                setup({ isDisabled: true, handleClick, linkProps: { href: 'https://example.com' } }, renderOptions);
                const link = screen.getByRole('link', { name: 'Label' });
                await userEvent.click(link);
                expect(handleClick).not.toHaveBeenCalled();
            });

            it('should render aria-disabled button with aria-disabled', () => {
                const { link } = setup({ 'aria-disabled': true, handleClick: vi.fn() }, renderOptions);
                expect(link).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not call handleClick when button is aria-disabled', async () => {
                const handleClick = vi.fn();
                const { link } = setup({ 'aria-disabled': true, handleClick }, renderOptions);
                if (link) await userEvent.click(link);
                expect(handleClick).not.toHaveBeenCalled();
            });

            it('should render aria-disabled link with aria-disabled', () => {
                setup({ 'aria-disabled': true, linkProps: { href: 'https://example.com' } }, renderOptions);
                const link = screen.getByRole('link', { name: 'Label' });
                expect(link).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not call handleClick when link is aria-disabled', async () => {
                const handleClick = vi.fn();
                setup(
                    { 'aria-disabled': true, handleClick, linkProps: { href: 'https://example.com' } },
                    renderOptions,
                );
                const link = screen.getByRole('link', { name: 'Label' });
                await userEvent.click(link);
                expect(handleClick).not.toHaveBeenCalled();
            });
        });
    });
};
