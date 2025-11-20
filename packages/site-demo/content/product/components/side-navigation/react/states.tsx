import { mdiEmail } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem
            label="Resting"
            icon={mdiEmail}
            emphasis={Emphasis.low}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            label="Selected"
            icon={mdiEmail}
            emphasis={Emphasis.low}
            isSelected
            toggleButtonProps={{ label: 'Toggle' }}
        />
    </SideNavigation>
);
