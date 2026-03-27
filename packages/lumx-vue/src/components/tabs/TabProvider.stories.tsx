import { ref } from 'vue';
import times from 'lodash/times';

import { Tab, TabList, TabListLayout, TabPanel, TabProvider } from '@lumx/vue';
import { Alignment } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';

export default {
    title: 'LumX components/tabs/TabProvider',
    parameters: { controls: { sort: 'alpha' } },
};

/** Default tab behavior */
export const Default = {
    render: ({ layout, position }: any) => (
        <TabProvider>
            <TabList aria-label="Tab list" layout={layout} position={position}>
                <Tab label="Tab 1" />
                <Tab label="Tab 2" isDisabled />
                <Tab label="Tab 3" />
            </TabList>
            <TabPanel style="padding: 24px">Tab 1 content</TabPanel>
            <TabPanel style="padding: 24px">Tab 2 content</TabPanel>
            <TabPanel style="padding: 24px">Tab 3 content</TabPanel>
        </TabProvider>
    ),
    argTypes: {
        layout: getSelectArgType(TabListLayout),
        position: getSelectArgType([Alignment.left, Alignment.center, Alignment.right]),
    },
};

/** Control active tab externally. */
export const Controlled = {
    render() {
        const activeTab = ref(1);
        const isLazy = ref(true);
        const shouldActivateOnFocus = ref(true);

        return () => (
            <>
                <div>
                    Active tab index:
                    <input
                        type="number"
                        min={0}
                        max={2}
                        value={activeTab.value}
                        onInput={(e: any) => (activeTab.value = parseInt(e.target.value, 10))}
                    />
                </div>
                <div>
                    Lazy render tab panel content:
                    <input
                        type="checkbox"
                        checked={isLazy.value}
                        onChange={(e: any) => (isLazy.value = e.target.checked)}
                    />
                </div>
                <div>
                    Activate tab on focus:
                    <input
                        type="checkbox"
                        checked={shouldActivateOnFocus.value}
                        onChange={(e: any) => (shouldActivateOnFocus.value = e.target.checked)}
                    />
                </div>
                <TabProvider
                    activeTabIndex={activeTab.value}
                    isLazy={isLazy.value}
                    shouldActivateOnFocus={shouldActivateOnFocus.value}
                    onChange={(i: number) => (activeTab.value = i)}
                >
                    <TabList aria-label="Tab list">
                        <Tab label="Tab a" />
                        <Tab label="Tab b" />
                        <Tab label="Tab c" />
                    </TabList>
                    <TabPanel style="padding: 24px">Tab a content</TabPanel>
                    <TabPanel style="padding: 24px">Tab b content</TabPanel>
                    <TabPanel style="padding: 24px">Tab c content</TabPanel>
                </TabProvider>
            </>
        );
    },
    parameters: { chromatic: { disable: true } },
    tags: ['!snapshot'],
};

/** Dynamically generate tabs. */
export const DynamicTabs = {
    render({ tabCount }: any) {
        const tabs = times(tabCount, (i: number) => i);
        return () => (
            <TabProvider>
                <TabList aria-label="Tab list">
                    {tabs.map((tabNumber: number) => (
                        <Tab key={tabNumber} label={`Tab ${tabNumber}`} />
                    ))}
                </TabList>
                {tabs.map((tabNumber: number) => (
                    <TabPanel key={tabNumber} style="padding: 24px">
                        Tab {tabNumber} content
                    </TabPanel>
                ))}
            </TabProvider>
        );
    },
    args: { tabCount: 3 },
    parameters: { chromatic: { disable: true } },
    tags: ['!snapshot'],
};
