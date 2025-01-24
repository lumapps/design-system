import { mdiBowl, mdiBreadSliceOutline, mdiSilverwareForkKnife } from '@lumx/icons';
import { Tab, TabList, TabPanel, TabProvider } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div style={{ minWidth: 340 }}>
            <TabProvider activeTabIndex={activeTab} onChange={setActiveTab}>
                <TabList theme={theme} aria-label="Tab list">
                    <Tab label="Tab 1" icon={mdiBowl} />
                    <Tab label="Tab 2" icon={mdiBreadSliceOutline} iconProps={{ color: 'red-L1', hasShape: false }} />
                    <Tab label="Tab 3" icon={mdiSilverwareForkKnife} />
                </TabList>

                <TabPanel className="lumx-spacing-padding-vertical-huge">Tab 1 content</TabPanel>
                <TabPanel className="lumx-spacing-padding-vertical-huge">Tab 2 content</TabPanel>
                <TabPanel className="lumx-spacing-padding-vertical-huge">Tab 3 content</TabPanel>
            </TabProvider>
        </div>
    );
};
