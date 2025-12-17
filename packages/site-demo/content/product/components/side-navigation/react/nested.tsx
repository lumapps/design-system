import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem label="Level 0 (closed)" toggleButtonProps={{ label: 'Toggle' }}>
            <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} toggleButtonProps={{ label: 'Toggle' }} />
        </SideNavigationItem>

        <SideNavigationItem label="Level 0 (open)" isOpen toggleButtonProps={{ label: 'Toggle' }}>
            <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} toggleButtonProps={{ label: 'Toggle' }} />
            <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} toggleButtonProps={{ label: 'Toggle' }} />
        </SideNavigationItem>
    </SideNavigation>
);
