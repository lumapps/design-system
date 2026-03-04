import { mdiArrowTopRightThick } from '@lumx/icons';
import { SideNavigation, SideNavigationItem } from '@lumx/react';

export default () => (
    <SideNavigation>
        <SideNavigationItem
            label="Low"
            icon={mdiArrowTopRightThick}
            emphasis="low"
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            label="Medium"
            icon={mdiArrowTopRightThick}
            emphasis="medium"
            toggleButtonProps={{ label: 'Toggle' }}
        />
        <SideNavigationItem
            label="High"
            icon={mdiArrowTopRightThick}
            emphasis="high"
            toggleButtonProps={{ label: 'Toggle' }}
        />
    </SideNavigation>
);
