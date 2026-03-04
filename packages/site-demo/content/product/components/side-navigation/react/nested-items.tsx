import { SideNavigation, SideNavigationItem } from '@lumx/react';

export default () => (
    <SideNavigation>
        <SideNavigationItem label="Level 0 (closed)" toggleButtonProps={{ label: 'Toggle' }}>
            <SideNavigationItem label="Level 1" emphasis="medium" toggleButtonProps={{ label: 'Toggle' }} />
        </SideNavigationItem>

        <SideNavigationItem label="Level 0 (open)" isOpen toggleButtonProps={{ label: 'Toggle' }}>
            <SideNavigationItem label="Level 1" emphasis="medium" toggleButtonProps={{ label: 'Toggle' }} />
            <SideNavigationItem label="Level 1" emphasis="medium" toggleButtonProps={{ label: 'Toggle' }} />
        </SideNavigationItem>
    </SideNavigation>
);
