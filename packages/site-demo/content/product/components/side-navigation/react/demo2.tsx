import { mdiEmail } from '@lumx/icons';
import { SideNavigation, SideNavigationItem } from '@lumx/react';

export default () => (
    <SideNavigation>
        <SideNavigationItem
            label="With leading icon"
            icon={mdiEmail}
            emphasis="low"
            toggleButtonProps={{ label: 'Toggle' }}
        />
    </SideNavigation>
);
