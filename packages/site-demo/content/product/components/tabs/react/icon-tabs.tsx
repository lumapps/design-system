import React, { useState } from 'react';

import { mdiBowl, mdiBreadSliceOutline, mdiSilverwareForkKnife } from '@lumx/icons';
import { Tab, Tabs, Theme } from '@lumx/react';
import classNames from 'classnames';

const App = ({ theme }: any) => {
    const [activeTab, setActiveTab] = useState(0);
    const handleTabClick = ({ index }: any) => {
        setActiveTab(index);
    };

    return (
        <>
            <Tabs theme={theme} activeTab={activeTab} onTabClick={handleTabClick}>
                <Tab label="Tab 1" icon={mdiBowl}>
                    <p
                        className={classNames(
                            'lumx-spacing-padding-vertical-huge',
                            theme === Theme.dark && 'lumx-color-font-light-N',
                        )}
                    >
                        Tab 1 content
                    </p>
                </Tab>

                <Tab label="Tab 2" icon={mdiBreadSliceOutline}>
                    <p
                        className={classNames(
                            'lumx-spacing-padding-vertical-huge',
                            theme === Theme.dark && 'lumx-color-font-light-N',
                        )}
                    >
                        Tab 2 content
                    </p>
                </Tab>

                <Tab label="Tab 3" icon={mdiSilverwareForkKnife}>
                    <p
                        className={classNames(
                            'lumx-spacing-padding-vertical-huge',
                            theme === Theme.dark && 'lumx-color-font-light-N',
                        )}
                    >
                        Tab 3 content
                    </p>
                </Tab>
            </Tabs>
        </>
    );
};

export default App;
