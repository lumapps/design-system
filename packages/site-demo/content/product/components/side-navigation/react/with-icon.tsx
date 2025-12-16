import { mdiEmail } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem
            label="With leading icon"
            icon={mdiEmail}
            emphasis={Emphasis.low}
            toggleButtonProps={{ label: 'Toggle' }}
        />
    </SideNavigation>
);
