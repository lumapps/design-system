import React, { Fragment, useState } from 'react';

import { Main } from './layout/Main';
import { MainNav } from './layout/MainNav';
import { SubNav } from './layout/SubNav';

export const App = (): JSX.Element => {
    const [activeComponent, setActiveComponent] = useState('');

    return (
        <Fragment>
            <MainNav />
            <SubNav handleNavigate={setActiveComponent} activeComponent={activeComponent} />
            <Main component={activeComponent} />
        </Fragment>
    );
};
