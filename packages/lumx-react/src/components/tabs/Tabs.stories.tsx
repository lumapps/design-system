/* eslint-disable react-hooks/rules-of-hooks */

import { Alignment, Button, Dialog, Tab, TabList, TabListLayout, TabPanel, TabProvider } from '@lumx/react';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { toFlattenProps } from '@lumx/react/stories/utils/toFlattenProps';
import { withCategory } from '@lumx/react/stories/utils/withCategory';
import times from 'lodash/times';
import { useState } from 'react';

export default {
    title: 'LumX components/tabs',
    decorators: [withNestedProps()],
    parameters: { controls: { sort: 'alpha' } },
};

/** Default tab behavior with some controllable args */
export const Default = {
    render: ({ tabProviderProps, tabListProps, tabProps }: any) => (
        <TabProvider {...tabProviderProps}>
            <TabList aria-label="Tab list" {...tabListProps}>
                <Tab {...tabProps[0]} />
                <Tab {...tabProps[1]} />
                <Tab {...tabProps[2]} />
            </TabList>
            <TabPanel className="lumx-spacing-padding-huge">{tabProps[0].label} content</TabPanel>
            <TabPanel className="lumx-spacing-padding-huge">{tabProps[1].label} content</TabPanel>
            <TabPanel className="lumx-spacing-padding-huge">{tabProps[2].label} content</TabPanel>
        </TabProvider>
    ),
    args: toFlattenProps({
        tabProps: [
            { label: 'Tab 1' },
            {
                label: 'Tab 2',
                isDisabled: true,
            },
            { label: 'Tab 3' },
        ],
    }),
    argTypes: toFlattenProps({
        tabProviderProps: withCategory('Tab Provider', {
            isLazy: { control: 'boolean' },
            shouldActivateOnFocus: { control: 'boolean' },
        }),
        tabListProps: withCategory('Tab List', {
            layout: getSelectArgType(TabListLayout),
            position: getSelectArgType([Alignment.left, Alignment.center, Alignment.right]),
        }),
        tabProps: times(3, (index) =>
            withCategory(`Tab ${index + 1}`, {
                label: { control: 'text' },
                icon: iconArgType,
                isDisabled: { control: 'boolean' },
            }),
        ),
    }),
};

/* Control active tab externally (with activate tab on focus). */
export const Controlled = {
    render() {
        const [activeTab, setActiveTab] = useState(1);
        const changeActiveTabIndex = (evt: any) => setActiveTab(parseInt(evt.target.value || 0, 10));

        const [isLazy, setIsLazy] = useState(true);
        const changeIsLazy = (evt: any) => setIsLazy(evt.target.checked);

        const [shouldActivateOnFocus, setShouldActivateOnFocus] = useState(true);
        const changeShouldActivateOnFocus = (evt: any) => setShouldActivateOnFocus(evt.target.checked);

        return (
            <>
                <div>
                    Active tab index:
                    <input type="number" min={0} max={2} value={activeTab} onChange={changeActiveTabIndex} />
                </div>

                <div>
                    Lazy render tab panel content:
                    <input type="checkbox" checked={isLazy} onChange={changeIsLazy} />
                </div>

                <div>
                    Activate tab on focus:
                    <input type="checkbox" checked={shouldActivateOnFocus} onChange={changeShouldActivateOnFocus} />
                </div>
                <TabProvider
                    activeTabIndex={activeTab}
                    onChange={setActiveTab}
                    isLazy={isLazy}
                    shouldActivateOnFocus={shouldActivateOnFocus}
                >
                    <TabList aria-label="Tab list">
                        <Tab label="Tab a" />
                        <Tab label="Tab b" />
                        <Tab label="Tab c" />
                    </TabList>

                    <TabPanel className="lumx-spacing-padding-huge">Tab a content</TabPanel>
                    <TabPanel className="lumx-spacing-padding-huge">Tab b content</TabPanel>
                    <TabPanel className="lumx-spacing-padding-huge">Tab c content</TabPanel>
                </TabProvider>
            </>
        );
    },
    chromatic: { disable: true },
};

/* Display tabs far from their tab panels. */
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
                <Dialog isOpen={isOpen} forceFooterDivider onClose={() => setOpen(false)}>
                    <TabPanel className="lumx-spacing-padding-huge">Tab 1 content</TabPanel>
                    <TabPanel className="lumx-spacing-padding-huge">Tab 2 content</TabPanel>
                    <TabPanel className="lumx-spacing-padding-huge">Tab 3 content</TabPanel>

                    <footer>
                        <TabList aria-label="Tab list">
                            <Tab label="Tab 1" />
                            <Tab label="Tab 2" />
                            <Tab label="Tab 3" />
                        </TabList>
                    </footer>
                </Dialog>
            </TabProvider>
        );
    },
    chromatic: { disable: true },
};

/* Dynamically generate tabs. */
export const DynamicTabs = {
    render({ tabCount }: any) {
        return (
            <TabProvider>
                <TabList aria-label="Tab list">
                    {times(tabCount, (tabNumber) => (
                        <Tab key={tabNumber} label={`Tab ${tabNumber}`} />
                    ))}
                </TabList>

                {times(tabCount, (tabNumber) => (
                    <TabPanel key={tabNumber} className="lumx-spacing-padding-huge">
                        Tab {tabNumber} content
                    </TabPanel>
                ))}
            </TabProvider>
        );
    },
    args: {
        tabCount: 3,
    },
    chromatic: { disable: true },
};
