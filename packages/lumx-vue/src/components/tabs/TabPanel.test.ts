import { render, screen } from '@testing-library/vue';
import BaseTabPanelTests, { setup } from '@lumx/core/js/components/Tabs/TabPanelTests';
import { CLASSNAME } from '@lumx/core/js/components/Tabs/TabPanel';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { TabPanel } from '.';

describe('<TabPanel />', () => {
    const renderTabPanel = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(TabPanel, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    // Run core tests
    BaseTabPanelTests({
        render: renderTabPanel,
        screen,
    });

    const setupTabPanel = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTabPanel, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupTabPanel, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tabPanel',
        forwardAttributes: 'tabPanel',
        forwardRef: 'tabPanel',
    });
});
