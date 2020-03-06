import { Theme } from '@lumx/demo/context/theme';
import { switchDevTheme } from '@lumx/demo/theme-switch/switch-dev';
import { switchProdTheme } from '@lumx/demo/theme-switch/switch-prod';

const getThemeId = (theme: string) => `theme-${theme}`;

const getThemeElement = (theme: Theme) => document.getElementById(getThemeId(theme));

async function switchToTheme(oldTheme: Theme, newTheme: Theme) {
    const oldThemeElement = getThemeElement(oldTheme);

    if (oldThemeElement?.tagName === 'LINK') {
        // In production.
        switchProdTheme(oldTheme, newTheme);
        return;
    }

    if (oldThemeElement?.tagName === 'SCRIPT') {
        // In development (for hot code reload).
        switchDevTheme(oldTheme, newTheme);
    }
}

export { switchToTheme };
