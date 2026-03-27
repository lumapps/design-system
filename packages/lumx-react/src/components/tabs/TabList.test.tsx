import { Tab } from '@lumx/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import BaseTabListTests from '@lumx/core/js/components/Tabs/TabListTests';

import { TabList, TabListProps } from './TabList';

const CLASSNAME = TabList.className as string;

type SetupProps = Partial<TabListProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const tabs = [<Tab key={0} label="Tab 0" />, <Tab key={1} label="Tab 1" />];
    const props: TabListProps = {
        children: tabs,
        'aria-label': 'Tab list',
        ...propsOverride,
    };

    render(<TabList {...props} />, { wrapper });
    const tabList = getByClassName(document.body, CLASSNAME);
    const links = queryByClassName(tabList, `${CLASSNAME}__links`);
    return { props, tabList, links };
};

describe(`<${TabList.displayName}>`, () => {
    BaseTabListTests({
        render: (props: any) => render(<TabList aria-label="Tab list" {...props} />),
        screen,
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
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
