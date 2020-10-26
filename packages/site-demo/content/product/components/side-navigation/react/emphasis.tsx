import { mdiArrowTopRightThick } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';
import React from 'react';

export const App = () => (
    <SideNavigation>
        <SideNavigationItem label="Low" icon={mdiArrowTopRightThick} emphasis={Emphasis.low} />
        <SideNavigationItem label="Medium" icon={mdiArrowTopRightThick} emphasis={Emphasis.medium} />
        <SideNavigationItem label="High" icon={mdiArrowTopRightThick} emphasis={Emphasis.high} />
    </SideNavigation>
);
