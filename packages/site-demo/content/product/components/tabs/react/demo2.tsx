import { useState } from 'react';
import { Tab, TabList, TabListLayout, TabPanel, TabProvider, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [activeTab, setActiveTab] = useState(0);
    return (
        <div style={{ minWidth: 260 }}>
            <TabProvider activeTabIndex={activeTab} onChange={setActiveTab}>
                <TabList theme={theme} layout={TabListLayout.clustered} aria-label="Tab list">
                    <Tab label="Tab 1" />
                    <Tab label="Tab 2" />
                    <Tab label="Tab 3" />
                </TabList>

                <TabPanel className="lumx-spacing-padding-vertical-huge">Tab 1 content</TabPanel>
                <TabPanel className="lumx-spacing-padding-vertical-huge">Tab 2 content</TabPanel>
                <TabPanel className="lumx-spacing-padding-vertical-huge">Tab 3 content</TabPanel>
            </TabProvider>
        </div>
    );
};
