import React from 'react';

import { SideNavigationItem, SideNavigation, Emphasis } from '@lumx/react';
import { mdiEmail } from '@lumx/icons';

const App = () => (
    <>
        <SideNavigation>
            <SideNavigationItem label="With leading icon" icon={mdiEmail} emphasis={Emphasis.low} />
        </SideNavigation>
    </>
);

export default App;
