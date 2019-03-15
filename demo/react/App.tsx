import { Theme } from '../constants';

/////////////////////////////

import React, { Fragment, useEffect, useState } from 'react';

import last from 'lodash/last';

import { ErrorBoundary } from './ErrorBoundary';
import { Main } from './layout/Main';
import { MainNav } from './layout/MainNav';
import { SubNav } from './layout/SubNav';

import { DEFAULT_THEME } from '../constants';
import { changeTheme as _changeTheme } from '../utils';

/////////////////////////////

/**
 * The main application component.
 * This component define the structure of the page (main navigation, sub navigation and main display).
 * It also handle the changes of the theme and the changes of the active component demo page (which will be displayed
 * in the main display component).
 *
 * @return {JSX.Element} The main application component.
 */
const App: React.FC = (): JSX.Element => {
    const [activeComponent, setActiveComponent]: [string, (activeComponent: string) => void] = useState(
        last(window.location.pathname.split('/')) || '',
    );
    const [theme, changeTheme]: [Theme, (theme: Theme) => void] = useState(DEFAULT_THEME);
    const [themeLoaded, setThemeLoaded]: [boolean, (isThemeLoaded: boolean) => void] = useState(false);

    useEffect((): void => {
        _changeTheme(theme).then(() => setThemeLoaded(true));
    }, [theme]);

    useEffect((): void => {
        window.history.pushState(activeComponent, 'Design System', `/${activeComponent}`);
    }, [activeComponent]);

    if (themeLoaded) {
        return (
            <Fragment>
                <MainNav />
                <SubNav
                    handleNavigate={setActiveComponent}
                    changeTheme={changeTheme}
                    activeComponent={activeComponent}
                />

                <ErrorBoundary>
                    <Main activeComponent={activeComponent} />
                </ErrorBoundary>
            </Fragment>
        );
    }

    return <div />;
};

/////////////////////////////

export { App };
