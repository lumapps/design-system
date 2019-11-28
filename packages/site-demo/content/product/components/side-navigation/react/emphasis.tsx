import React from 'react';

import { mdiArrowTopRightThick } from '@lumx/icons';
import { Emphasis, SideNavigation, SideNavigationItem } from '@lumx/react';

const App = () => (
    <>
        <SideNavigation>
            <SideNavigationItem label="Low" icon={mdiArrowTopRightThick} emphasis={Emphasis.low} />
            <SideNavigationItem label="Medium" icon={mdiArrowTopRightThick} emphasis={Emphasis.medium} />
            <SideNavigationItem label="High" icon={mdiArrowTopRightThick} emphasis={Emphasis.high} />
        </SideNavigation>
    </>
);

export default App;
