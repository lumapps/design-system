import { Button, Dialog, Tab, TabList, TabPanel, TabProvider } from '@lumx/react';
import { number } from '@storybook/addon-knobs';
import get from 'lodash/get';
import times from 'lodash/times';
import React, { useState } from 'react';

export default { title: 'LumX components/tabs' };

/* Control active tab externally (with activate tab on focus). */
export const Controlled = ({ theme }: any) => {
    const [activeTab, setActiveTab] = useState(1);
    const changeActiveTabIndex = (evt: any) => setActiveTab(parseInt(get(evt, 'target.value', '0'), 10));

    const [isLazy, setIsLazy] = useState(true);
    const changeIsLazy = (evt: any) => setIsLazy(get(evt, 'target.checked'));

    const [shouldActivateOnFocus, setShouldActivateOnFocus] = useState(true);
    const changeShouldActivateOnFocus = (evt: any) => setShouldActivateOnFocus(get(evt, 'target.checked'));

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
                <TabList theme={theme} aria-label="Tab list">
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
};

/* Control active tab internally (with activate tab on focus). */
export const NotControlled = ({ theme }: any) => {
    return (
        <TabProvider shouldActivateOnFocus onChange={console.log}>
            <TabList theme={theme} aria-label="Tab list">
                <Tab label="Tab a" />
                <Tab label="Tab b" />
            </TabList>
            <TabPanel className="lumx-spacing-padding-huge">Tab a content</TabPanel>
            <TabPanel className="lumx-spacing-padding-huge">Tab b content</TabPanel>
        </TabProvider>
    );
};

/* Display tabs far from their tab panels. */
export const DisabledTab = ({ theme }: any) => (
    <TabProvider shouldActivateOnFocus>
        <TabList theme={theme} aria-label="Tab list">
            <Tab label="Tab 1" />
            <Tab label="Tab 2" isDisabled />
            <Tab label="Tab 3" />
        </TabList>
        <TabPanel className="lumx-spacing-padding-huge">Tab 1 content</TabPanel>
        <TabPanel className="lumx-spacing-padding-huge">Tab 2 content</TabPanel>
        <TabPanel className="lumx-spacing-padding-huge">Tab 3 content</TabPanel>
    </TabProvider>
);

/* Display tabs far from their tab panels. */
export const SplitTabListAndTabPanels = ({ theme }: any) => {
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
                    <TabList theme={theme} aria-label="Tab list">
                        <Tab label="Tab 1" />
                        <Tab label="Tab 2" />
                        <Tab label="Tab 3" />
                    </TabList>
                </footer>
            </Dialog>
        </TabProvider>
    );
};

/* Dynamically generate tabs. */
export const DynamicTabs = ({ theme }: any) => {
    const tabCount = number('Tab count', 3);
    return (
        <TabProvider>
            <TabList theme={theme} aria-label="Tab list">
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
};
