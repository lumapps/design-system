import { mdiEmail } from '@lumx/icons';
import { SideNavigation, SideNavigationItem } from '@lumx/react';

export default () => (
    <SideNavigation>
        <SideNavigationItem label="Resting" icon={mdiEmail} emphasis="low" toggleButtonProps={{ label: 'Toggle' }} />
        <SideNavigationItem
            label="Selected"
            icon={mdiEmail}
            emphasis="low"
            isSelected
            toggleButtonProps={{ label: 'Toggle' }}
        />
    </SideNavigation>
);
