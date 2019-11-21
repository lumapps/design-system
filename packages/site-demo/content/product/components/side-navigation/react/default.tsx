import React from 'react';

import { SideNavigationItem, SideNavigation, Emphasis } from '@lumx/react';

const App = () => (
    <>
        <SideNavigation>
            <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
            <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
            <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
            <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
            <SideNavigationItem label="Navigation item" emphasis={Emphasis.low} />
        </SideNavigation>
    </>
);

export default App;
