import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} toggleButtonProps={{ label: 'Toggle' }} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} toggleButtonProps={{ label: 'Toggle' }} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} toggleButtonProps={{ label: 'Toggle' }} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} toggleButtonProps={{ label: 'Toggle' }} />
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} toggleButtonProps={{ label: 'Toggle' }} />
    </SideNavigation>
);
