/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from 'react';

import { Button, Dialog, Tab, TabList, TabPanel, TabProvider } from '@lumx/react';
import { expect, screen, waitFor } from 'storybook/test';
import type { GenericStory } from '@lumx/react/stories/utils/types';

export default {
    title: 'LumX components/tabs/TabProvider/Tests',
    tags: ['!snapshot'],
    parameters: { chromatic: { disable: true } },
};

/** Test: tabs inside a dialog should have correct tabindex and focus on open */
export const SplitTabListAndTabPanels = {
    render() {
        const [isOpen, setOpen] = useState(true);
        const [activeTabIndex, onChange] = useState(1);

        return (
            <TabProvider activeTabIndex={activeTabIndex} onChange={onChange} isLazy={false}>
                <Button
                    onClick={() => {
                        setOpen(!isOpen);
                        onChange(1);
                    }}
                >
                    Open dialog with tabs in footer
                </Button>
                <Dialog isOpen={isOpen} forceHeaderDivider onClose={() => setOpen(false)}>
                    <header>
                        <TabList aria-label="Tab list">
                            <Tab label="Tab 1" />
                            <Tab label="Tab 2" />
                            <Tab label="Tab 3" />
                        </TabList>
                    </header>

                    <TabPanel className="lumx-spacing-padding-huge">Tab 1 content</TabPanel>
                    <TabPanel className="lumx-spacing-padding-huge">Tab 2 content</TabPanel>
                    <TabPanel className="lumx-spacing-padding-huge">Tab 3 content</TabPanel>
                </Dialog>
            </TabProvider>
        );
    },
    async play() {
        // Wait for the dialog and tabs to be fully rendered.
        await screen.findByRole('dialog');

        await waitFor(() => {
            const tabs = screen.getAllByRole('tab');
            expect(tabs).toHaveLength(3);

            // Tab 2 (index 1) should be the active tab.
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
            expect(tabs[1]).toHaveAttribute('tabindex', '0');

            // Other tabs should have tabindex="-1".
            expect(tabs[0]).toHaveAttribute('tabindex', '-1');
            expect(tabs[2]).toHaveAttribute('tabindex', '-1');
        });

        await waitFor(() => {
            // Only the active tab panel is queryable by role (inactive panels have tabindex="-1").
            const activeTabPanel = screen.getByRole('tabpanel', { name: 'Tab 2' });
            expect(activeTabPanel).toHaveAttribute('tabindex', '0');

            // The active tab (in the header) is the first focusable element in DOM order,
            // so the dialog's focus trap should focus it.
            const tabs = screen.getAllByRole('tab');
            expect(tabs[1]).toHaveFocus();
        });
    },
} satisfies GenericStory;
