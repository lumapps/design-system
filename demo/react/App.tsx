import React, { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { DEFAULT_THEME } from '../constants';
import { changeTheme as _changeTheme, setDemoCustomColors } from '../utils';

import { ErrorBoundary } from './layout/ErrorBoundary';
import { Main } from './layout/Main';
import { MainNav } from './layout/MainNav';

import './index.css';

/**
 * The main application component.
 *
 * @return The main application component.
 */
const App: React.FC = (): ReactElement => {
    const [theme, changeTheme] = useState(DEFAULT_THEME);
    const [themeLoaded, setThemeLoaded] = useState(false);

    useEffect((): void => {
        _changeTheme(theme).then((): void => {
            setThemeLoaded(true);
            setDemoCustomColors(theme);
        });
    }, [theme]);

    if (themeLoaded) {
        return (
            <Router>
                <MainNav />

                <ErrorBoundary>
                    <Main changeTheme={changeTheme} theme={theme} />
                </ErrorBoundary>
            </Router>
        );
    }

    return <div />;
};

export { App };
