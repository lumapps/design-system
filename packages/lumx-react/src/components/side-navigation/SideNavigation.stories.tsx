import React from 'react';

import { mdiAccount } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export default {
    title: 'LumX components/side-navigation/Side Navigation',
    argTypes: {
        onClick: { action: true },
        onActionClick: { action: true },
    },
};

const CustomLink: React.FC<{ children?: React.ReactNode }> = ({ children, ...props }) =>
    React.createElement('a', { ...props, style: { color: 'red' } }, children);

export const Simple = ({ onClick }: any) => (
    <SideNavigation>
        <SideNavigationItem
            onClick={onClick}
            label="Navigation item"
            emphasis={Emphasis.low}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            onClick={onClick}
            label="Navigation item"
            emphasis={Emphasis.low}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            onClick={onClick}
            label="Navigation item"
            emphasis={Emphasis.low}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            onClick={onClick}
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com' }}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            onClick={onClick}
            label="Navigation item"
            emphasis={Emphasis.low}
            linkProps={{ href: 'https://www.google.com/not-visited' }}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            onClick={onClick}
            label="Navigation item (custom link)"
            emphasis={Emphasis.low}
            linkAs={CustomLink}
            linkProps={{ href: 'https://www.google.com/not-visited-1' }}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            onClick={onClick}
            label="Navigation item"
            emphasis={Emphasis.low}
            toggleButtonProps={{ label: 'Toggle' }}
        />
    </SideNavigation>
);

export const With3Levels = ({ onClick }: any) => {
    const [l1IsOpen, setL1IsOpen] = React.useState(true);
    const [l2IsOpen, setL2IsOpen] = React.useState(true);
    const toggleL1 = (evt: any) => {
        setL1IsOpen(!l1IsOpen);
        onClick?.(evt);
    };
    const toggleL2 = (evt: any) => {
        setL2IsOpen(!l2IsOpen);
        onClick?.(evt);
    };

    return (
        <SideNavigation>
            <SideNavigationItem
                label="Level 1"
                emphasis={Emphasis.high}
                isOpen={l1IsOpen}
                onClick={toggleL1}
                toggleButtonProps={{ label: 'Toggle' }}
            >
                <SideNavigationItem
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    onClick={toggleL2}
                    toggleButtonProps={{ label: 'Toggle' }}
                >
                    <SideNavigationItem
                        label="Level 3"
                        emphasis={Emphasis.low}
                        onClick={onClick}
                        toggleButtonProps={{ label: 'Toggle' }}
                    />
                </SideNavigationItem>
            </SideNavigationItem>
        </SideNavigation>
    );
};

export const With3LevelsAndIcons = ({ onClick }: any) => {
    const [l1IsOpen, setL1IsOpen] = React.useState(true);
    const [l2IsOpen, setL2IsOpen] = React.useState(true);
    const toggleL1 = (evt: any) => {
        setL1IsOpen(!l1IsOpen);
        onClick?.(evt);
    };
    const toggleL2 = (evt: any) => {
        setL2IsOpen(!l2IsOpen);
        onClick?.(evt);
    };

    return (
        <SideNavigation>
            <SideNavigationItem
                label="Level 1"
                emphasis={Emphasis.high}
                isOpen={l1IsOpen}
                onClick={toggleL1}
                icon={mdiAccount}
                toggleButtonProps={{ label: 'Toggle' }}
            >
                <SideNavigationItem
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    onClick={toggleL2}
                    icon={mdiAccount}
                    toggleButtonProps={{ label: 'Toggle' }}
                >
                    <SideNavigationItem
                        label="Level 3.1"
                        onClick={onClick}
                        emphasis={Emphasis.low}
                        isSelected
                        toggleButtonProps={{ label: 'Toggle' }}
                    />
                    <SideNavigationItem
                        label="Level 3.2"
                        onClick={onClick}
                        emphasis={Emphasis.low}
                        icon={mdiAccount}
                        toggleButtonProps={{ label: 'Toggle' }}
                    />
                    <SideNavigationItem
                        label="Level 3.3"
                        onClick={onClick}
                        emphasis={Emphasis.low}
                        icon={mdiAccount}
                        toggleButtonProps={{ label: 'Toggle' }}
                    />
                </SideNavigationItem>
            </SideNavigationItem>
        </SideNavigation>
    );
};

export const With3LevelsAndMultiActions = ({ onClick, onActionClick }: any) => {
    const [l1IsOpen, setL1IsOpen] = React.useState(true);
    const [l2IsOpen, setL2IsOpen] = React.useState(true);
    const toggleL1 = () => setL1IsOpen(!l1IsOpen);
    const toggleL2 = () => setL2IsOpen(!l2IsOpen);
    const onClickMessage = (message: string) => (evt: any) => onClick(message, evt);
    const onActionMessage = (message: string, callback?: any) => (evt: any) => {
        onActionClick(message, evt);
        callback?.(evt);
    };

    return (
        <SideNavigation>
            <SideNavigationItem
                label="Level 1"
                emphasis={Emphasis.high}
                isOpen={l1IsOpen}
                onClick={onClickMessage('Level 1 item is clicked')}
                icon={mdiAccount}
                onActionClick={onActionMessage('Level 1 action is clicked', toggleL1)}
                toggleButtonProps={{ label: 'Toggle' }}
            >
                <SideNavigationItem
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    isOpen={l2IsOpen}
                    onClick={onClickMessage('Level 2 item is clicked')}
                    onActionClick={onActionMessage('Level 2 action is clicked', toggleL2)}
                    toggleButtonProps={{ label: 'Toggle' }}
                >
                    <SideNavigationItem
                        label="Level 3.1"
                        emphasis={Emphasis.low}
                        onClick={onClickMessage('Level 3.1 item is clicked')}
                        onActionClick={onActionMessage('Level 3.1 action is clicked')}
                        toggleButtonProps={{ label: 'Toggle' }}
                    />
                    <SideNavigationItem
                        label="Level 3.2"
                        emphasis={Emphasis.low}
                        onClick={onClickMessage('Level 3.2 item is clicked')}
                        onActionClick={onActionMessage('Level 3.2 action is clicked')}
                        toggleButtonProps={{ label: 'Toggle' }}
                    />
                </SideNavigationItem>
            </SideNavigationItem>
        </SideNavigation>
    );
};

/** Using closeMode="hide" keeps children in DOM on close */
export const CloseModeHide = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleL1 = () => setIsOpen(!isOpen);

    return (
        <SideNavigation>
            <SideNavigationItem
                closeMode="hide"
                label="Level 1"
                emphasis={Emphasis.high}
                isOpen={isOpen}
                onClick={toggleL1}
                toggleButtonProps={{ label: 'Toggle' }}
            >
                <SideNavigationItem
                    closeMode="hide"
                    label="Level 2"
                    emphasis={Emphasis.medium}
                    toggleButtonProps={{ label: 'Toggle' }}
                />
            </SideNavigationItem>
        </SideNavigation>
    );
};
