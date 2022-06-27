import { Tab, TabList, TabPanel, TabProvider } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <div style={{ minWidth: 260 }}>
        <TabProvider>
            <TabList theme={theme} aria-label="Tab list">
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
