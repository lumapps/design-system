import { Tab, TabProvider } from '@lumx/react';
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

    describe('role', () => {
        it('should render a navigation landmark when used outside a TabProvider', () => {
            render(
                <TabList aria-label="Site nav">
                    <Tab as="a" href="/a" label="A" />
                    <Tab as="a" href="/b" label="B" />
                </TabList>,
            );

            const nav = screen.getByRole('navigation', { name: 'Site nav' });
            expect(nav).toHaveClass(`${CLASSNAME}__links`);
            expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

            // Outer wrapper element + its classes stay unchanged and contain the landmark.
            const tabList = getByClassName(document.body, CLASSNAME);
            expect(tabList).toContainElement(nav);
        });

        it('should render a tablist when used inside a TabProvider', () => {
            render(
                <TabProvider>
                    <TabList aria-label="Tab list">
                        <Tab label="A" />
                        <Tab label="B" />
                    </TabList>
                </TabProvider>,
            );

            expect(screen.getByRole('tablist', { name: 'Tab list' })).toBeInTheDocument();
            expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
        });
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
