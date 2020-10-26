import { mdiEmail } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';
import React from 'react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem label="Resting" icon={mdiEmail} emphasis={Emphasis.low} />
        <SideNavigationItem label="Selected" icon={mdiEmail} emphasis={Emphasis.low} isSelected />
    </SideNavigation>
);
