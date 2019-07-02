import React, { Fragment, useState } from 'react';

import { Button, Tabs, TabsProps, TabsTheme } from 'LumX';
import { Tab } from 'LumX/components/tabs/react/Tab';
import { mdiBowl, mdiBreadSliceOutline } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: TabsTheme;
}

/////////////////////////////

/**
 * The demo for the default <Tabs>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [activeTab, setActiveTab]: [TabsProps['activeTab'], React.Dispatch<React.SetStateAction<number>>] = useState(
        0,
    );

    const handleTabClick: CallableFunction = ({ index }: { index: number }): void => {
        setActiveTab(index);
    };

    const setFirstTabActive: CallableFunction = (): void => {
        setActiveTab(0);
    };

    return (
        <Fragment>
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
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
