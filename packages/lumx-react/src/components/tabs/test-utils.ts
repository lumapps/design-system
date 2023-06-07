/* istanbul ignore file */

/**
 * Test util module. Do not import in production code !
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, within } from '@testing-library/react';

/** RTL queries for tabs */
export const query = {
    tabList: (name: string) => screen.getByRole('tablist', { name }),
    tabs: (tabList?: any) => (tabList ? within(tabList) : screen).getAllByRole('tab'),
    tab: (name: string, tabList?: any) => (tabList ? within(tabList) : screen).getByRole('tab', { name }),
    tabPanel: (name: string) => screen.getByRole('tabpanel', { name }),
};

/** Assert that the given tab is active */
export const checkTabActive = (activeTabName: string, { isLazy = true } = {}) => {
    for (const tab of query.tabs()) {
        const isTabActive = tab.textContent === activeTabName;

        // Tab state
        expect(tab).toHaveAttribute('aria-selected', String(isTabActive));
        expect(tab).toHaveAttribute('tabindex', isTabActive ? '0' : '-1');

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
