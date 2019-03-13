import React, { Fragment, useEffect, useState } from 'react';

import { Main } from './layout/Main';
import { MainNav } from './layout/MainNav';
import { SubNav } from './layout/SubNav';

import { DEFAULT_THEME } from '../constants';
import { changeTheme as _changeTheme } from '../utils';

export const App = (): JSX.Element => {
    const [activeComponent, setActiveComponent] = useState('');
    const [theme, changeTheme] = useState(DEFAULT_THEME);

    useEffect(() => {
        _changeTheme(theme);
    });

    return (
        <Fragment>
            <MainNav />
            <SubNav handleNavigate={setActiveComponent} changeTheme={changeTheme} activeComponent={activeComponent} />
            <Main component={activeComponent} />
        </Fragment>
    );
};
