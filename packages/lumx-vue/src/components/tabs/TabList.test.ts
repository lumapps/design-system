import { render, screen } from '@testing-library/vue';
import BaseTabListTests, { setup } from '@lumx/core/js/components/Tabs/TabListTests';
import { TABS_CLASSNAME as CLASSNAME } from '@lumx/core/js/components/Tabs/constants';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { TabList } from '.';

describe('<TabList />', () => {
    const renderTabList = (props: any, options?: SetupRenderOptions<any>) => render(TabList, { ...options, props });

    // Run core tests
    BaseTabListTests({
        render: renderTabList,
        screen,
    });

    const setupTabList = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTabList, screen });

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
