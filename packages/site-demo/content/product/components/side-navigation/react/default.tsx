import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';
import React from 'react';

const App = () => (
    <SideNavigation>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low}/>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low}/>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low}/>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low}/>
        <SideNavigationItem label="Navigation item" emphasis={Emphasis.low}/>
    </SideNavigation>
);

export default App;
