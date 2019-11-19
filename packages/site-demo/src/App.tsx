import React, { ReactElement, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { DEFAULT_ENGINE, DEFAULT_THEME, THEMES, Engine, Theme } from '@lumx/demo/constants';
import { setDemoCustomColors } from '@lumx/demo/utils';

import { ErrorBoundary } from './layout/ErrorBoundary';
import { Main } from './layout/Main';
import { MainNav } from './layout/MainNav';

import './index.css';

/**
 * Disable/Enable theme style sheet.
 *
 * @param theme    The theme to disable/enable.
 * @param disabled true to disable the stylesheet; false to enable it.
 */
function setThemeStyleSheetDisabled(theme: string, disabled: boolean): void {
    // tslint:disable-next-line:no-any
    const element: any = document.getElementById(`theme-${theme}`);
    if (!element) {
        throw new Error(`Could not find '<link>' element for theme "${theme}"`);
    }
    element.disabled = disabled;
    const sheet = element.sheet || element.styleSheet;
    if (!sheet) {
        return;
    }
    sheet.disabled = disabled;
}

/**
 * Enable a theme and disable the other one.
 *
 * @param theme The theme to enable.
 */
function switchThemeStyle(theme: string): void {
    setThemeStyleSheetDisabled(theme, false);
    const otherTheme = theme === THEMES.lumapps ? THEMES.material : THEMES.lumapps;
    setThemeStyleSheetDisabled(otherTheme, true);
}

/**
 * The main application component.
 *
 * @return The main application component.
 */
const App: React.FC = (): ReactElement => {
    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [engine, setEngine] = useState(DEFAULT_ENGINE);
    const changeTheme = (newTheme: Theme): void => {
        setTheme(newTheme);
        switchThemeStyle(newTheme);
	    setDemoCustomColors(theme);
    };
    const changeEngine = (newEngine: Engine): void => {
        setEngine(newEngine);
    };

    return (
        <Router>
            <MainNav />

            <ErrorBoundary>
                <Main changeEngine={changeEngine} changeTheme={changeTheme} engine={engine} theme={theme} />
            </ErrorBoundary>
        </Router>
    );
};

export { App };
