import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME } from './GridColumn';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { children: 'GridColumn content', ...propsOverride };
    const wrapper = render(props, options);

    const gridColumn = getByClassName(document.body, CLASSNAME);
    const div = gridColumn; // Alias for commonTestsSuite compatibility
    return { props, gridColumn, div, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('GridColumn core tests', () => {
        describe('Props', () => {
            it('should override CSS props', () => {
                const { gridColumn } = setup(
                    {
                        gap: 'regular',
                        maxColumns: 10,
                        itemMinWidth: 300,
                    },
                    renderOptions,
                );

                expect(gridColumn).toHaveAttribute(
                    'style',
                    '--lumx-grid-column-item-min-width: 300px; --lumx-grid-column-columns: 10; --lumx-grid-column-gap: var(--lumx-spacing-unit-regular);',
                );
            });
        });
    });
};
