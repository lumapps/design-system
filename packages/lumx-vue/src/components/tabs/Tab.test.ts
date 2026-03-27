import { render, screen } from '@testing-library/vue';
import BaseTabTests, { setup } from '@lumx/core/js/components/Tabs/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Tabs/Tab';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Tab } from '.';

describe('<Tab />', () => {
    const renderTab = (props: any, options?: SetupRenderOptions<any>) => render(Tab, { ...options, props });

    // Run core tests
    BaseTabTests({
        render: renderTab,
        screen,
    });

    const setupTab = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTab, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupTab, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tab',
        forwardAttributes: 'tab',
        forwardRef: 'tab',
    });
});
