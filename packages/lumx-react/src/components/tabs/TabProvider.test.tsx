import { Tab, TabList, TabPanel, TabProvider, TabProviderProps } from '@lumx/react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { checkTabActive, query } from '@lumx/react/components/tabs/test-utils';
import { vi } from 'vitest';

const setup = (props: Partial<TabProviderProps> = {}) => {
    return render(
        <TabProvider {...props}>
            <TabList aria-label="Tab list">
                <Tab label="Tab 1" />
                <Tab label="Tab 2" isDisabled />
                <Tab label="Tab 3" />
            </TabList>

            <TabPanel>Tab 1 content</TabPanel>
            <TabPanel>Tab 2 content</TabPanel>
            <TabPanel>Tab 3 content</TabPanel>
        </TabProvider>,
    );
};

describe('TabProvider', () => {
    describe('default config', () => {
        it('should render with accessible DOM', () => {
            setup();

            // Tab list
            const tabList = query.tabList('Tab list');
            expect(tabList).toBeInTheDocument();
            expect(query.tabs(tabList).length).toBe(3);

            // Tab 1
            const tab1 = query.tab('Tab 1', tabList);
            expect(tab1).toBeInTheDocument();

            // Tab 2
            const tab2 = query.tab('Tab 2', tabList);
            expect(tab2).toBeInTheDocument();

            // Tab 3
            const tab3 = query.tab('Tab 3', tabList);
            expect(tab3).toBeInTheDocument();

            // Tab panel 1
            const tabPanel1 = query.tabPanel('Tab 1');
            expect(tabPanel1).toBeInTheDocument();
            expect(tab1).toHaveAttribute('aria-controls', tabPanel1?.id);

            // Tab panel 2
            const tabPanel2 = query.tabPanel('Tab 2');
            expect(tabPanel2).toBeInTheDocument();
            expect(tab2).toHaveAttribute('aria-controls', tabPanel2?.id);

            // Tab panel 3
            const tabPanel3 = query.tabPanel('Tab 3');
            expect(tabPanel3).toBeInTheDocument();
            expect(tab3).toHaveAttribute('aria-controls', tabPanel3?.id);

            // First tab is active — it should be the roving tabindex entry point
            checkTabActive('Tab 1');
            expect(tab1).toHaveAttribute('tabindex', '0');
            expect(tab2).toHaveAttribute('tabindex', '-1');
            expect(tab3).toHaveAttribute('tabindex', '-1');
        });

        it('should switch tab on click', async () => {
            setup();

            checkTabActive('Tab 1');

            // Click on second tab (that is disabled) should do nothing
            await userEvent.click(query.tab('Tab 2'));
            checkTabActive('Tab 1');

            // Click on third tab should work
            await userEvent.click(query.tab('Tab 3'));
            checkTabActive('Tab 3');
        });

        it('should be navigable with keyboard', async () => {
            setup();

            checkTabActive('Tab 1');

            // First tab stop on active tab (tab1)
            await userEvent.tab();
            expect(query.tab('Tab 1')).toHaveFocus();

            // Second tab stop on active tab panel (tabPanel1)
            await userEvent.tab();
            expect(query.tabPanel('Tab 1')).toHaveFocus();

            // Go back to tab1
            await userEvent.tab({ shift: true });
            expect(query.tab('Tab 1')).toHaveFocus();

            // Navigate with ArrowRight — goes to disabled tab2
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Tab 2')).toHaveFocus();

            // Activate tab with Enter should not work on disabled tab
            await userEvent.keyboard('{Enter}');
            expect(query.tab('Tab 2')).toHaveFocus();
            checkTabActive('Tab 1');

            // Navigate with ArrowRight to go to tab3
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Tab 3')).toHaveFocus();

            // Activate tab with Enter
            await userEvent.keyboard('{Enter}');
            expect(query.tab('Tab 3')).toHaveFocus();
            checkTabActive('Tab 3');

            // Focus next should go to active tab panel (tabPanel3)
            await userEvent.tab();
            expect(query.tabPanel('Tab 3')).toHaveFocus();

            // Go back to tab3
            await userEvent.tab({ shift: true });
            expect(query.tab('Tab 3')).toHaveFocus();

            // Navigate with ArrowRight to loop back to the first tab (tab1)
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Tab 1')).toHaveFocus();

            // Navigate with ArrowLeft to loop back to the last tab (tab3), through disabled tab2
            await userEvent.keyboard('[ArrowLeft]');
            expect(query.tab('Tab 3')).toHaveFocus();

            checkTabActive('Tab 3');
        });

        it('should navigate with Home and End keys', async () => {
            setup();

            // Tab into the tab list
            await userEvent.tab();
            expect(query.tab('Tab 1')).toHaveFocus();

            // End key should go to the last tab (tab3)
            await userEvent.keyboard('[End]');
            expect(query.tab('Tab 3')).toHaveFocus();

            // Home key should go to the first tab (tab1)
            await userEvent.keyboard('[Home]');
            expect(query.tab('Tab 1')).toHaveFocus();
        });
    });

    describe('initial activeTabIndex', () => {
        it('should render the correct tab as active on first render when activeTabIndex is non-zero', () => {
            setup({ activeTabIndex: 2 });

            // Tab 3 (index 2) should be active from the very first render
            checkTabActive('Tab 3');
        });
    });

    describe('Controlled mode', () => {
        it('should call onChange and respond to activeTabIndex prop', async () => {
            const onChange = vi.fn();
            const { rerender } = setup({ activeTabIndex: 0, onChange });

            checkTabActive('Tab 1');

            // Switch to tab 3
            await userEvent.click(query.tab('Tab 3'));
            await waitFor(() => expect(onChange).toHaveBeenCalledWith(2));

            // Re-render with new index to simulate external state update
            rerender(
                <TabProvider activeTabIndex={2} onChange={onChange}>
                    <TabList aria-label="Tab list">
                        <Tab label="Tab 1" />
                        <Tab label="Tab 2" isDisabled />
                        <Tab label="Tab 3" />
                    </TabList>
                    <TabPanel>Tab 1 content</TabPanel>
                    <TabPanel>Tab 2 content</TabPanel>
                    <TabPanel>Tab 3 content</TabPanel>
                </TabProvider>,
            );
            checkTabActive('Tab 3');

            // Change prop back to 0 externally
            rerender(
                <TabProvider activeTabIndex={0} onChange={onChange}>
                    <TabList aria-label="Tab list">
                        <Tab label="Tab 1" />
                        <Tab label="Tab 2" isDisabled />
                        <Tab label="Tab 3" />
                    </TabList>
                    <TabPanel>Tab 1 content</TabPanel>
                    <TabPanel>Tab 2 content</TabPanel>
                    <TabPanel>Tab 3 content</TabPanel>
                </TabProvider>,
            );
            checkTabActive('Tab 1');
        });
    });

    describe('not lazy', () => {
        it('should render tab panel everytime', () => {
            setup({ isLazy: false });
            // Check the first tab is active and all panel are loaded
            checkTabActive('Tab 1', { isLazy: false });
        });
    });

    describe('activate on focus', () => {
        it('should activate tab on focus', async () => {
            setup({ shouldActivateOnFocus: true });

            checkTabActive('Tab 1');

            await userEvent.tab();
            expect(query.tab('Tab 1')).toHaveFocus();
            checkTabActive('Tab 1');

            // ArrowRight goes to disabled tab2 (shouldActivateOnFocus has no effect on disabled tabs)
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Tab 2')).toHaveFocus();
            // Active tab unchanged since tab 2 is disabled
            checkTabActive('Tab 1');

            // ArrowRight goes to tab3
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Tab 3')).toHaveFocus();
            // Active tab changed to tab 3 (since shouldActivateOnFocus is true)
            checkTabActive('Tab 3');
        });
    });
});
