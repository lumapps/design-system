/* istanbul ignore file */

/**
 * Test util module. Do not import in production code!
 */

export const createTabTestUtils = ({ screen, within }: { screen: any; within: any }) => {
    const query = {
        tabList: (name: string) => screen.getByRole('tablist', { name }),
        tabs: (tabList?: any) => (tabList ? within(tabList) : screen).getAllByRole('tab'),
        tab: (name: string, tabList?: any) => (tabList ? within(tabList) : screen).getByRole('tab', { name }),
        tabPanel: (name: string) => screen.getByRole('tabpanel', { name }),
    };

    const checkTabActive = (activeTabName: string, { isLazy = true } = {}) => {
        for (const tab of query.tabs()) {
            const isTabActive = tab.textContent === activeTabName;

            // Tab state
            expect(tab).toHaveAttribute('aria-selected', String(isTabActive));

            const tabPanel = query.tabPanel(tab.textContent as string);

            // Tab panel state
            expect(tabPanel).toHaveAttribute('tabindex', isTabActive ? '0' : '-1');

            if (!isTabActive && isLazy) {
                // Tab panel content not rendered when isLazy and not active
                expect(tabPanel).toBeEmptyDOMElement();
            } else {
                expect(tabPanel).not.toBeEmptyDOMElement();
            }
        }
    };

    return { query, checkTabActive };
};
