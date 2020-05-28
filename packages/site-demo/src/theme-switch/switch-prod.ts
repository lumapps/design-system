import { GlobalTheme } from '@lumx/core/js/types';

const getThemeId = (theme: string) => `theme-${theme}`;

const getThemeElement = (theme: GlobalTheme) => document.getElementById(getThemeId(theme));

/**
 * Switch between LumApps/Material theme in production mode.
 *
 * 1. Activate the new theme <link> tag
 * 2. Disable the previous theme <link> tag
 *
 * @param oldTheme Previously selected theme
 * @param newTheme New theme to apply
 */
export function switchProdTheme(oldTheme: GlobalTheme, newTheme: GlobalTheme) {
    const oldStyle = getThemeElement(oldTheme) as HTMLLinkElement;
    const newStyle = getThemeElement(newTheme) as HTMLLinkElement;
    newStyle.rel = 'stylesheet';

    setTimeout(() => {
        oldStyle.rel = 'preload';
    }, 100);
}
