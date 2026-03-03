import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { Size, Theme } from '../../constants';

const CLASSNAME = 'lumx-chip';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const chip = getByClassName(document.body, CLASSNAME);
    return { props, chip, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('Chip core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { chip } = setup({ children: 'Chip text' }, renderOptions);
                expect(chip).toBeInTheDocument();
                expect(chip).toHaveTextContent('Chip text');
                expect(chip.className).toContain('lumx-chip');
                expect(chip.className).toContain('lumx-chip--color-dark');
                expect(chip.className).toContain('lumx-chip--size-m');
                expect(chip.className).toContain('lumx-chip--is-unselected');
            });

            it('should render dark theme', () => {
                const { chip } = setup({ theme: Theme.dark }, renderOptions);
                expect(chip).toHaveClass('lumx-chip--color-light');
            });

            it('should render a link', () => {
                setup({ children: 'Chip text', href: 'https://google.com', target: '_blank' }, renderOptions);
                const chip = screen.getByRole('link', { name: 'Chip text' });
                expect(chip).toHaveAttribute('href', 'https://google.com');
                expect(chip).toHaveAttribute('target', '_blank');
                expect(chip).toHaveAttribute('tabIndex', '0');
            });

            it('should override the role', () => {
                setup({ children: 'Chip text', role: 'radio' }, renderOptions);
                expect(screen.getByRole('radio', { name: 'Chip text' })).toBeInTheDocument();
            });

            it('should override the tabIndex', () => {
                const { chip } = setup({ children: 'Chip text', tabIndex: -1 }, renderOptions);
                expect(chip).toHaveAttribute('tabIndex', '-1');
            });
        });

        describe('Styling', () => {
            it('should render highlighted state', () => {
                const { chip } = setup({ isHighlighted: true }, renderOptions);
                expect(chip).toHaveClass('lumx-chip--is-highlighted');
            });

            it('should render selected state', () => {
                const { chip } = setup({ isSelected: true }, renderOptions);
                expect(chip).toHaveClass('lumx-chip--is-selected');
                expect(chip).not.toHaveClass('lumx-chip--is-unselected');
            });

            it('should render small size', () => {
                const { chip } = setup({ size: Size.s }, renderOptions);
                expect(chip).toHaveClass('lumx-chip--size-s');
            });
        });
    });
};
