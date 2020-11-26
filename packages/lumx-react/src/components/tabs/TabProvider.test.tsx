import { Tab, TabList, TabPanel, TabProvider } from '@lumx/react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import React from 'react';

describe(`<${TabProvider.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render', () => {
            const wrapper = mount(
                <TabProvider>
                    <TabList aria-label="Tab list">
                        <Tab label="tab 1" />
                        <Tab label="tab 1" />
                    </TabList>

                    <TabPanel>Tab 1 content</TabPanel>
                    <TabPanel>Tab 2 content</TabPanel>
                </TabProvider>,
            );
            const tabs = wrapper.find(Tab).find('button');
            const firstTab = tabs.get(0);
            const secondTab = tabs.get(1);

            const tabPanels = wrapper.find(TabPanel).find('div');
            const firstTabPanel = tabPanels.get(0);
            const secondTabPanel = tabPanels.get(1);

            // First tab is selected.
            expect(firstTab.props['aria-selected']).toBe(true);
            expect(secondTab.props['aria-selected']).toBe(false);

            // Tab id and tab panel aria-labelledby by should match
            expect(firstTab.props.id).toBe(firstTabPanel.props['aria-labelledby']);
            expect(secondTab.props.id).toBe(secondTabPanel.props['aria-labelledby']);

            // Tab panel id and tab aria-controls by should match
            expect(firstTabPanel.props.id).toBe(firstTab.props['aria-controls']);
            expect(secondTabPanel.props.id).toBe(secondTab.props['aria-controls']);
        });
    });
});
