import React, { useEffect, useState } from 'react';

import { GlobalTheme } from '@lumx/core/js/types';
import { setDemoCustomColors } from '@lumx/demo/utils/setDemoCustomColors';

import { createGlobalThemeSwitcher } from './theme-switcher';

import '@lumx/demo/style/theme/material.scss';

interface State {
    globalTheme: GlobalTheme;
    changeGlobalTheme?(newGlobalTheme: GlobalTheme): void;
}

// Default loaded theme.
const DEFAULT_STATE: State = { globalTheme: 'material' };

/**
 * React context storing the site global theme.
 */
export const GlobalThemeContext = React.createContext(DEFAULT_STATE);

let themeSwitcher: undefined | ((theme: GlobalTheme) => void);

/**
 * Provide the ThemeContext in children components.
 *
 * The setter will provoke a switch between 2 CSS files.
 *
 * @param children Children components.
 * @return The ThemeProvider.
 */
export const GlobalThemeProvider: React.FC = ({ children }) => {
    const [globalTheme, changeGlobalTheme] = useState(DEFAULT_STATE.globalTheme);

    useEffect(() => {
        if (!themeSwitcher) {
            themeSwitcher = createGlobalThemeSwitcher(DEFAULT_STATE.globalTheme);
        }
        themeSwitcher?.(globalTheme);
        setDemoCustomColors(globalTheme);
    }, [globalTheme]);

    return (
        <GlobalThemeContext.Provider value={{ globalTheme, changeGlobalTheme }}>{children}</GlobalThemeContext.Provider>
    );
};
