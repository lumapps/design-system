import React, { ReactElement, useState } from 'react';

import { Button, Tab, Tabs, Theme } from 'LumX';
import { mdiBowl, mdiBreadSliceOutline } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Tabs>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick: CallableFunction = ({ index }: { index: number }): void => {
        setActiveTab(index);
    };

    const setFirstTabActive: CallableFunction = (): void => {
        setActiveTab(0);
    };

    return (
        <>
            <Tabs theme={theme} activeTab={activeTab} onTabClick={handleTabClick}>
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

            <Button onClick={setFirstTabActive}>Set first tab as active tab</Button>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
