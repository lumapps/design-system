import React, { useEffect, useState } from 'react';

import { GlobalTheme } from '@lumx/core/js/types';
import { switchToTheme } from '@lumx/demo/theme-switch';
import { setDemoCustomColors } from '@lumx/demo/utils';

const DEFAULT: { changeGlobalTheme: null | ((theme: GlobalTheme) => void); globalTheme: GlobalTheme } = {
    changeGlobalTheme: null,
    globalTheme: 'lumapps',
};

export const GlobalThemeContext = React.createContext(DEFAULT);

/**
 * Provide the ThemeContext in children components.
 *
 * The setter will provoke a switch between 2 CSS files.
 *
 * @param children Children components.
 * @return The ThemeProvider.
 */
export const GlobalThemeProvider: React.FC = ({ children }) => {
    const [globalTheme, setGlobalTheme] = useState(DEFAULT.globalTheme);

    useEffect(() => {
        switchToTheme('material', 'lumapps');
    }, []);

    const changeGlobalTheme = (newTheme: GlobalTheme) => {
        if (newTheme === globalTheme) {
            return;
        }
        setGlobalTheme(newTheme);
        setDemoCustomColors(globalTheme);
        switchToTheme(globalTheme, newTheme);
    };

    return (
        <GlobalThemeContext.Provider value={{ globalTheme, changeGlobalTheme }}>{children}</GlobalThemeContext.Provider>
    );
};
