import { nextTick, ref } from 'vue';
import { render, screen, waitFor, within } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import userEvent from '@testing-library/user-event';
import { createTabTestUtils } from '@lumx/core/js/components/Tabs/TabProviderTestUtils';
import { vi } from 'vitest';

import { Tab, TabList, TabPanel, TabProvider } from '.';

const { query, checkTabActive } = createTabTestUtils({ screen, within });

const setup = async (props: any = {}) => {
    const result = render({
        setup() {
            return () => (
                <TabProvider {...props}>
                    <TabList aria-label="Tab list">
                        <Tab label="Tab 1" />
                        <Tab label="Tab 2" isDisabled />
                        <Tab label="Tab 3" />
                    </TabList>
                    <TabPanel>Tab 1 content</TabPanel>
                    <TabPanel>Tab 2 content</TabPanel>
                    <TabPanel>Tab 3 content</TabPanel>
                </TabProvider>
            );
        },
    });
    await flushPromises();
    return result;
};

describe('TabProvider', () => {
    describe('default config', () => {
        it('should render with accessible DOM', async () => {
            await setup();

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

            // First tab is active
            checkTabActive('Tab 1');
            expect(tab1).toHaveAttribute('tabindex', '0');
            expect(tab2).toHaveAttribute('tabindex', '-1');
            expect(tab3).toHaveAttribute('tabindex', '-1');
        });

        it('should switch tab on click', async () => {
            await setup();

            checkTabActive('Tab 1');

            // Click on second tab (disabled) should do nothing
            await userEvent.click(query.tab('Tab 2'));
            checkTabActive('Tab 1');

            // Click on third tab should work
            await userEvent.click(query.tab('Tab 3'));
            checkTabActive('Tab 3');
        });

        it('should be navigable with keyboard', async () => {
            await setup();

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
            checkTabActive('Tab 1');

            // Navigate with ArrowRight to go to tab3
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Tab 3')).toHaveFocus();

            // Activate tab with Enter
            await userEvent.keyboard('{Enter}');
            checkTabActive('Tab 3');

            // Navigate with ArrowRight to loop back to first tab (tab1)
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Tab 1')).toHaveFocus();

            // Navigate with ArrowLeft to loop back to last tab (tab3), skipping disabled tab2
            await userEvent.keyboard('[ArrowLeft]');
            expect(query.tab('Tab 3')).toHaveFocus();

            checkTabActive('Tab 3');
        });

        it('should navigate with Home and End keys', async () => {
            await setup();

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
        it('should render the correct tab as active on first render when activeTabIndex is non-zero', async () => {
            await setup({ activeTabIndex: 2 });

            checkTabActive('Tab 3');
        });
    });

    describe('Controlled mode', () => {
        it('should call onChange and respond to activeTabIndex prop', async () => {
            const onChange = vi.fn();
            const activeTabIndex = ref(0);

            render({
                setup() {
                    return () => (
                        <TabProvider activeTabIndex={activeTabIndex.value} onChange={(i: number) => onChange(i)}>
                            <TabList aria-label="Tab list">
                                <Tab label="Tab 1" />
                                <Tab label="Tab 2" isDisabled />
                                <Tab label="Tab 3" />
                            </TabList>
                            <TabPanel>Tab 1 content</TabPanel>
                            <TabPanel>Tab 2 content</TabPanel>
                            <TabPanel>Tab 3 content</TabPanel>
                        </TabProvider>
                    );
                },
            });
            await flushPromises();

            checkTabActive('Tab 1');

            // Switch to tab 3
            await userEvent.click(query.tab('Tab 3'));
            await waitFor(() => expect(onChange).toHaveBeenCalledWith(2));

            // Simulate external state update
            activeTabIndex.value = 2;
            await flushPromises();
            checkTabActive('Tab 3');

            // Change prop back to 0 externally
            activeTabIndex.value = 0;
            await flushPromises();
            checkTabActive('Tab 1');
        });
    });

    describe('not lazy', () => {
        it('should render tab panel every time', async () => {
            await setup({ isLazy: false });
            checkTabActive('Tab 1', { isLazy: false });
        });
    });

    describe('activate on focus', () => {
        it('should activate tab on focus', async () => {
            await setup({ shouldActivateOnFocus: true });

            checkTabActive('Tab 1');

            await userEvent.tab();
            expect(query.tab('Tab 1')).toHaveFocus();
            checkTabActive('Tab 1');

            // ArrowRight goes to disabled tab2 (shouldActivateOnFocus has no effect on disabled tabs)
            await userEvent.keyboard('[ArrowRight]');
            await flushPromises();
            expect(query.tab('Tab 2')).toHaveFocus();
            checkTabActive('Tab 1');

            // ArrowRight goes to tab3
            await userEvent.keyboard('[ArrowRight]');
            await flushPromises();
            expect(query.tab('Tab 3')).toHaveFocus();
            checkTabActive('Tab 3');
        });
    });
});
