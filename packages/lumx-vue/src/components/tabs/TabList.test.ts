import { render, screen } from '@testing-library/vue';
import { defineComponent } from 'vue';
import BaseTabListTests, { setup } from '@lumx/core/js/components/Tabs/TabListTests';
import { TABS_CLASSNAME as CLASSNAME } from '@lumx/core/js/components/Tabs/constants';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Tab, TabList, TabProvider } from '.';

describe('<TabList />', () => {
    const renderTabList = (props: any, options?: SetupRenderOptions<any>) => render(TabList, { ...options, props });

    // Run core tests
    BaseTabListTests({
        render: renderTabList,
        screen,
    });

    const setupTabList = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTabList, screen });

    describe('role', () => {
        it('should render a navigation landmark when used outside a TabProvider', () => {
            render(
                defineComponent({
                    components: { TabList, Tab },
                    template: `
                        <TabList aria-label="Main navigation">
                            <Tab label="Home">
                                <template #action><a href="/home" /></template>
                            </Tab>
                            <Tab label="Profile">
                                <template #action><a href="/profile" /></template>
                            </Tab>
                        </TabList>
                    `,
                }),
            );

            expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
            expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
            expect(screen.getAllByRole('link')).toHaveLength(2);
        });

        it('should render a tablist when used inside a TabProvider', () => {
            render(
                defineComponent({
                    components: { TabList, Tab, TabProvider },
                    template: `
                        <TabProvider>
                            <TabList aria-label="Classic tabs">
                                <Tab label="Tab 1" />
                                <Tab label="Tab 2" />
                            </TabList>
                        </TabProvider>
                    `,
                }),
            );

            expect(screen.getByRole('tablist', { name: 'Classic tabs' })).toBeInTheDocument();
            expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupTabList, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tabList',
        forwardAttributes: 'tabList',
        forwardRef: 'tabList',
        applyTheme: {
            affects: [{ element: 'tabList' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
