import React from 'react';

import { SideNavigationItem, SideNavigation, Emphasis } from '@lumx/react';
import { mdiEmail } from '@lumx/icons';

const App = () => (
    <>
        <SideNavigation>
            <SideNavigationItem label="Resting" icon={mdiEmail} emphasis={Emphasis.low} />
            <SideNavigationItem label="Selected" icon={mdiEmail} emphasis={Emphasis.low} isSelected />
        </SideNavigation>
    </>
);

export default App;
