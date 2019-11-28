import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

const App = () => (
    <>
        <SideNavigation>
            <SideNavigationItem label="With leading icon" icon={mdiEmail} emphasis={Emphasis.low} />
        </SideNavigation>
    </>
);

export default App;
