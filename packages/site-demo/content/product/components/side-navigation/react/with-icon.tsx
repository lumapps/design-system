import { mdiEmail } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';
import React from 'react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem label="With leading icon" icon={mdiEmail} emphasis={Emphasis.low} />
    </SideNavigation>
);
