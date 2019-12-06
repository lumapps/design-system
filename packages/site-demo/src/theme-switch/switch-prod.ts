import { Theme } from '@lumx/demo/context/theme';

const getThemeId = (theme) => `theme-${theme}`;

const getThemeElement = (theme: Theme) => document.getElementById(getThemeId(theme));

/**
 * Switch between LumApps/Material theme in production mode.
 *
 * 1. Activate the new theme <link> tag
 * 2. Disable the previous theme <link> tag
 *
 * @param oldTheme Previously selected theme
 * @param newTheme New theme to apply
 */
export function switchProdTheme(oldTheme: Theme, newTheme: Theme) {
    const oldStyle = getThemeElement(oldTheme) as HTMLLinkElement;
    const newStyle = getThemeElement(newTheme) as HTMLLinkElement;
    newStyle.rel = 'stylesheet';

    setTimeout(() => {
        oldStyle.rel = 'preload';
    }, 100);
}
