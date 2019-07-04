import React, { ReactElement, useEffect, useState } from 'react';

import last from 'lodash/last';

import { DEFAULT_THEME } from '../constants';
import { changeTheme as _changeTheme } from '../utils';

import { ErrorBoundary } from './ErrorBoundary';
import { Main } from './layout/Main';
import { MainNav } from './layout/MainNav';
import { SubNav } from './layout/SubNav';

/////////////////////////////

/**
 * The main application component.
 * This component define the structure of the page (main navigation, sub navigation and main display).
 * It also handle the changes of the theme and the changes of the active component demo page (which will be displayed
 * in the main display component).
 *
 * @return The main application component.
 */
const App: React.FC = (): ReactElement => {
    const [activeComponent, setActiveComponent] = useState(last(window.location.pathname.split('/')) || '');
    const [theme, changeTheme] = useState(DEFAULT_THEME);
    const [themeLoaded, setThemeLoaded] = useState(false);

    useEffect((): void => {
        _changeTheme(theme).then(
            (): void => {
                setThemeLoaded(true);
            },
        );
    }, [theme]);

    useEffect((): void => {
        window.history.pushState(activeComponent, 'Design System', `/${activeComponent}`);
    }, [activeComponent]);

    if (themeLoaded) {
        return (
            <>
                <MainNav />
                <SubNav
                    handleNavigate={setActiveComponent}
                    changeTheme={changeTheme}
                    activeComponent={activeComponent}
                />

                <ErrorBoundary>
                    <Main activeComponent={activeComponent} />
                </ErrorBoundary>
            </>
        );
    }

    return <div />;
};

/////////////////////////////

export { App };
