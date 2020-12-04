import React from 'react';

import { mdiAccount } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export default { title: 'LumX components/side-navigation/Side Navigation' };

const CustomLink: React.FC = ({ children, ...props }) =>
    React.createElement('a', { ...props, style: { color: 'red' } }, children);

export const Simple = () => (
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
            label="Navigation item (custom link)"
            emphasis={Emphasis.low}
            linkAs={CustomLink}
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
                <SideNavigationItem label="Level 2" emphasis={Emphasis.medium} isOpen={l2IsOpen} onClick={toggleL2}>
                    <SideNavigationItem label="Level 3" emphasis={Emphasis.low} />
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
                icon={mdiAccount}
            >
                <SideNavigationItem
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    onClick={toggleL2}
                    icon={mdiAccount}
                >
                    <SideNavigationItem label="Level 3.1" emphasis={Emphasis.low} isSelected />
                    <SideNavigationItem label="Level 3.2" emphasis={Emphasis.low} icon={mdiAccount} />
                    <SideNavigationItem label="Level 3.3" emphasis={Emphasis.low} icon={mdiAccount} />
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
    const alertMessage = (message: string) => () => alert(message);

    return (
        <SideNavigation>
            <SideNavigationItem
                label="Level 1"
                emphasis={Emphasis.high}
                isOpen={l1IsOpen}
                linkProps={{ href: 'javascript:alert("Level 1")' }}
                icon={mdiAccount}
                onActionClick={toggleL1}
            >
                <SideNavigationItem
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    linkProps={{ href: 'javascript:alert("Level 2")' }}
                    onActionClick={toggleL2}
                >
                    <SideNavigationItem
                        label="Level 3.1"
                        emphasis={Emphasis.low}
                        linkProps={{ href: 'javascript:alert("Level 3.1 item is clicked")' }}
                        onActionClick={alertMessage('Level 3.1 action is clicked')}
                    />
                    <SideNavigationItem
                        label="Level 3.2"
                        emphasis={Emphasis.low}
                        onClick={alertMessage('Level 3.2 item is clicked')}
                        onActionClick={alertMessage('Level 3.2 action is clicked')}
                    />
                </SideNavigationItem>
            </SideNavigationItem>
        </SideNavigation>
    );
};
