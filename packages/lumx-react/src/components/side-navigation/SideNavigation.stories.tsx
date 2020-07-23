import React from 'react';

import { mdiAccount } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export default { title: 'LumX components/side-navigation/Side Navigation' };

export const sideNavigation = () => (
    <SideNavigation>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
        <SideNavigationItem
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com' }}
        />
        <SideNavigationItem
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com/not-visited' }}
        />
        <SideNavigationItem
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com/not-visited-1' }}
        />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
    </SideNavigation>
);

export const With3Levels = () => {
    const [l1IsOpen, setL1IsOpen] = React.useState(true);
    const [l2IsOpen, setL2IsOpen] = React.useState(true);
    const toggleL1 = () => setL1IsOpen(!l1IsOpen);
    const toggleL2 = () => setL2IsOpen(!l2IsOpen);

    return (
        <SideNavigation>
            <SideNavigationItem label="Level 1" emphasis={Emphasis.high} isOpen={l1IsOpen} onClick={toggleL1}>
                <SideNavigationItem
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    onClick={toggleL2}
                    level={2}
                >
                    <SideNavigationItem label="Level 3" emphasis={Emphasis.low} level={3} />
                </SideNavigationItem>
            </SideNavigationItem>
        </SideNavigation>
    );
};

export const With3LevelsAndIcons = () => {
    const [l1IsOpen, setL1IsOpen] = React.useState(true);
    const [l2IsOpen, setL2IsOpen] = React.useState(true);
    const toggleL1 = () => setL1IsOpen(!l1IsOpen);
    const toggleL2 = () => setL2IsOpen(!l2IsOpen);

    return (
        <SideNavigation>
            <SideNavigationItem
                label="Level 1"
                emphasis={Emphasis.high}
                isOpen={l1IsOpen}
                onClick={toggleL1}
                level={1}
                icon={mdiAccount}
            >
                <SideNavigationItem
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    onClick={toggleL2}
                    level={2}
                    icon={mdiAccount}
                >
                    <SideNavigationItem label="Level 3" emphasis={Emphasis.low} level={3} icon={mdiAccount} />
                </SideNavigationItem>
            </SideNavigationItem>
        </SideNavigation>
    );
};

export const With3LevelsAndMultiActions = () => {
    const [l1IsOpen, setL1IsOpen] = React.useState(true);
    const [l2IsOpen, setL2IsOpen] = React.useState(true);
    const toggleL1 = () => setL1IsOpen(!l1IsOpen);
    const toggleL2 = () => setL2IsOpen(!l2IsOpen);
    const action3Click = () => alert('Level 3 chevron');

    return (
        <SideNavigation>
            <SideNavigationItem
                label="Level 1"
                emphasis={Emphasis.high}
                isOpen={l1IsOpen}
                // tslint:disable-next-line: ter-no-script-url
                linkProps={{ href: 'javascript:alert("Level 1")' }}
                onClick={toggleL1}
                icon={mdiAccount}
            >
                <SideNavigationItem
                    label="Level 2"
                    level={2}
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    // tslint:disable-next-line: ter-no-script-url
                    linkProps={{ href: 'javascript:alert("Level 2")' }}
                    onClick={toggleL2}
                >
                    <SideNavigationItem
                        label="Level 3"
                        level={3}
                        emphasis={Emphasis.low}
                        // tslint:disable-next-line: ter-no-script-url
                        linkProps={{ href: 'javascript:alert("Level 3")' }}
                        onClick={action3Click}
                    />
                </SideNavigationItem>
            </SideNavigationItem>
        </SideNavigation>
    );
};
