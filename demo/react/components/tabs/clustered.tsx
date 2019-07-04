import React, { ReactElement, useState } from 'react';

import { mdiBowl, mdiBreadSliceOutline } from '@mdi/js';
import { Tab, Tabs, TabsLayout, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the clustered <Tabs>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick: CallableFunction = ({ index }: { index: number }): void => {
        setActiveTab(index);
    };

    return (
        <>
            <Tabs theme={theme} layout={TabsLayout.clustered} activeTab={activeTab} onTabClick={handleTabClick}>
                <Tab label="First Tab" icon={mdiBreadSliceOutline}>
                    <p className="p+">Bread</p>
                </Tab>

                <Tab label="Second Tab">
                    <p className="p+">Banana</p>
                </Tab>

                <Tab label="Third Tab" icon={mdiBowl} isDisabled={true}>
                    <p className="p+">Bowl</p>
                </Tab>
            </Tabs>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
