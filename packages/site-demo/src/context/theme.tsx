import React, { useState } from 'react';

import { setDemoCustomColors } from '@lumx/demo/utils';

/**
 * The available themes in the demo site.
 */
enum Theme {
    lumapps = 'lumapps',
    material = 'material',
}

type changeThemeType = null | ((theme: Theme) => void);

const DEFAULT = {
    changeTheme: null as changeThemeType,
    theme: Theme.lumapps,
};

const ThemeContext = React.createContext(DEFAULT);

/**
 * Disable/Enable theme style sheet.
 *
 * @param theme    The theme to disable/enable.
 * @param disabled true to disable the stylesheet; false to enable it.
 */
function setThemeStyleSheetDisabled(theme: string, disabled: boolean): void {
    // tslint:disable-next-line:no-any
    const element = document.getElementById(`theme-${theme}`) as HTMLLinkElement;
    if (!element) {
        throw new Error(`Could not find '<link>' element for theme "${theme}"`);
    }
    element.rel = disabled ? 'preload' : 'stylesheet';
}

/**
 * Enable a theme and disable the other one.
 *
 * @param theme The theme to enable.
 */
function switchThemeStyle(theme: string): void {
    setThemeStyleSheetDisabled(theme, false);
    setTimeout(() => {
        const otherTheme = theme === Theme.lumapps ? Theme.material : Theme.lumapps;
        setThemeStyleSheetDisabled(otherTheme, true);
    }, 100);
}

/**
 * Provide the ThemeContext in children components.
 *
 * The setter will provoke a switch between 2 CSS files.
 *
 * @param children Children components.
 * @return The ThemeProvider.
 */
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(DEFAULT.theme);

    const changeTheme = (newTheme: Theme): void => {
        if (newTheme === theme) {
            return;
        }
        setTheme(newTheme);
        switchThemeStyle(newTheme);
        setDemoCustomColors(theme);
    };

    return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};

export { Theme, ThemeContext, ThemeProvider };
