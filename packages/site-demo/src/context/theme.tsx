import React, { useState } from 'react';

import { switchToTheme } from '@lumx/demo/theme-switch';
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
        setDemoCustomColors(theme);
        switchToTheme(theme, newTheme);
    };

    return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};

export { Theme, ThemeContext, ThemeProvider };
