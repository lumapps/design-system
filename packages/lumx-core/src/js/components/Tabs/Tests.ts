import { mdiPlay } from '@lumx/icons';

import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';

const CLASSNAME = 'lumx-tabs__link';
const ICON_CLASSNAME = 'lumx-icon';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { label: 'Label', ...propsOverride };
    const wrapper = render(props, options);
    const tab = getByClassName(document.body, CLASSNAME);
    return { props, tab, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('Tab core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const label = 'Label';
                const { tab } = setup({ label }, renderOptions);
                expect(tab).toBe(screen.queryByRole('tab', { name: label }));
                expect(tab.tagName).toBe('BUTTON');
                expect(tab).toHaveAttribute('type', 'button');
                expect(queryByClassName(tab, ICON_CLASSNAME)).not.toBeInTheDocument();
            });

            it('should render icon', () => {
                const { tab } = setup({ icon: mdiPlay }, renderOptions);
                expect(queryByClassName(tab, ICON_CLASSNAME)).toBeInTheDocument();
            });

            it('should render icon with props', () => {
                const { tab } = setup(
                    { icon: mdiPlay, iconProps: { color: 'green', colorVariant: 'L2', hasShape: true } },
                    renderOptions,
                );
                const icon = queryByClassName(tab, ICON_CLASSNAME);
                expect(icon).toHaveClass('lumx-icon--color-green', 'lumx-icon--color-variant-L2');
            });
        });
    });
};
