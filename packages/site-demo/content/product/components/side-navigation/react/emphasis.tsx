import { mdiArrowTopRightThick } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem
            label="Low"
            icon={mdiArrowTopRightThick}
            emphasis={Emphasis.low}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            label="Medium"
            icon={mdiArrowTopRightThick}
            emphasis={Emphasis.medium}
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            label="High"
            icon={mdiArrowTopRightThick}
            emphasis={Emphasis.high}
            toggleButtonProps={{ label: 'Toggle' }}
        />
    </SideNavigation>
);
