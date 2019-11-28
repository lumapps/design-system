import React from 'react';

import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

const App = () => (
    <>
        <SideNavigation>
            <SideNavigationItem label="Level 0 (closed)">
                <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} />
            </SideNavigationItem>

            <SideNavigationItem label="Level 0 (open)" isOpen>
                <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} />
                <SideNavigationItem label="Level 1" emphasis={Emphasis.medium} />
            </SideNavigationItem>
        </SideNavigation>
    </>
);

export default App;
