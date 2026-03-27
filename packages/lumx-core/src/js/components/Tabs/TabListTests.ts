import { Alignment } from '../../constants';
import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';

import { TabListLayout } from './TabList';
import { TABS_CLASSNAME } from './constants';

const CLASSNAME = TABS_CLASSNAME;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { 'aria-label': 'Tab list', ...propsOverride };
    const wrapper = render(props, options);
    const tabList = getByClassName(document.body, CLASSNAME);
    const links = queryByClassName(tabList, `${CLASSNAME}__links`);
    return { props, tabList, links, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('TabList core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const name = 'Tab list';
                const { links } = setup({ 'aria-label': name }, renderOptions);
                expect(links).toBe(screen.queryByRole('tablist', { name }));
            });

            it('should render layout', () => {
                const { tabList } = setup({ layout: TabListLayout.clustered }, renderOptions);
                expect(tabList).toHaveClass('lumx-tabs--layout-clustered');
            });

            it('should render position', () => {
                const { tabList } = setup({ position: Alignment.center }, renderOptions);
                expect(tabList).toHaveClass('lumx-tabs--position-center');
            });
        });
    });
};
