import { mdiBowl, mdiBreadSliceOutline, mdiSilverwareForkKnife } from '@lumx/icons';
import { Tab, Tabs, Theme } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [activeTab, setActiveTab] = useState(0);
    const handleTabClick = ({ index }: any) => {
        setActiveTab(index);
    };

    return (
        <Tabs
            className={theme === Theme.dark && 'lumx-color-font-light-N'}
            theme={theme}
            activeTab={activeTab}
            onTabClick={handleTabClick}
        >
            <Tab label="Tab 1" icon={mdiBowl} className>
                <p className="lumx-spacing-padding-vertical-huge">Tab 1 content</p>
            </Tab>

            <Tab label="Tab 2" icon={mdiBreadSliceOutline}>
                <p className="lumx-spacing-padding-vertical-huge">Tab 2 content</p>
            </Tab>

            <Tab label="Tab 3" icon={mdiSilverwareForkKnife}>
                <p className="lumx-spacing-padding-vertical-huge">Tab 3 content</p>
            </Tab>
        </Tabs>
    );
};
