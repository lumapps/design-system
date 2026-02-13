import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { ColorPalette } from '../../constants';

const CLASSNAME = 'lumx-badge';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const badge = getByClassName(document.body, CLASSNAME);
    const div = badge; // Alias for commonTestsSuite compatibility
    return { props, badge, div, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('Badge core tests', () => {
        describe('Props', () => {
            it('should use default props', () => {
                const { badge } = setup({ children: '30' }, renderOptions);

                expect(badge.className).toContain('lumx-badge');
                expect(badge.className).toContain('lumx-badge--color-primary');
                expect(badge).toHaveTextContent(/30/);
            });

            it('should render color', () => {
                const { badge } = setup({ children: 'Badge', color: ColorPalette.red }, renderOptions);

                expect(badge).toHaveClass('lumx-badge--color-red');
            });
        });

        describe('Content Rendering', () => {
            it('should render string content', () => {
                setup({ children: 'New Content' }, renderOptions);
                expect(screen.getByText('New Content')).toBeInTheDocument();
            });
        });
    });
};
