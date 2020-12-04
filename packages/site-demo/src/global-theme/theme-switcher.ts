import { GlobalTheme } from '@lumx/core/js/types';

const DELAY_THEME_DISABLE = 200;

type ThemeSwitcher = (theme: GlobalTheme) => Promise<void>;

/**
 * In development both themes are loaded in <link> that need to be disabled.
 */
function createDevThemeSwitcher(defaultGlobalTheme: GlobalTheme, defaultLinkStylesheet: any): ThemeSwitcher {
    let otherLinkStylesheet: any;
    let oldGlobalTheme = defaultGlobalTheme;
    return async (newGlobalTheme: GlobalTheme) => {
        if (oldGlobalTheme === newGlobalTheme) {
            return;
        }
        oldGlobalTheme = newGlobalTheme;
        if (newGlobalTheme !== defaultGlobalTheme) {
            if (!otherLinkStylesheet) {
                await import(`../style/theme/${newGlobalTheme}.scss`);
                // eslint-disable-next-line prefer-destructuring
                otherLinkStylesheet = document.querySelectorAll('link[rel=stylesheet]:not(#font)')[1];
            }
            otherLinkStylesheet.disabled = false;
            setTimeout(() => {
                // eslint-disable-next-line no-param-reassign
                defaultLinkStylesheet.disabled = true;
            }, DELAY_THEME_DISABLE);
        } else {
            // eslint-disable-next-line no-param-reassign
            defaultLinkStylesheet.disabled = false;
            setTimeout(() => {
                if (otherLinkStylesheet) {
                    otherLinkStylesheet.disabled = true;
                }
            }, DELAY_THEME_DISABLE);
        }
    };
}

/**
 * In production, the default theme is loaded in a <style> and the other theme in a <link>.
 */
function createProdThemeSwitcher(defaultGlobalTheme: GlobalTheme, defaultStylesheet: any): ThemeSwitcher {
    let otherStylesheet: any;
    let oldGlobalTheme = defaultGlobalTheme;
    return async (newGlobalTheme: GlobalTheme) => {
        if (oldGlobalTheme === newGlobalTheme) {
            return;
        }
        oldGlobalTheme = newGlobalTheme;
        if (newGlobalTheme !== defaultGlobalTheme) {
            if (!otherStylesheet) {
                await import(`../style/theme/${newGlobalTheme}.scss`);
                const styles = document.querySelectorAll('style');
                otherStylesheet = styles[styles.length - 1];
            } else {
                document.head.appendChild(otherStylesheet);
            }
            setTimeout(() => {
                defaultStylesheet.parentNode.removeChild(defaultStylesheet);
            }, DELAY_THEME_DISABLE);
        } else {
            document.head.appendChild(defaultStylesheet);
            setTimeout(() => {
                otherStylesheet.parentNode.removeChild(otherStylesheet);
            }, DELAY_THEME_DISABLE);
        }
    };
}

export function createGlobalThemeSwitcher(defaultGlobalTheme: GlobalTheme): ThemeSwitcher | undefined {
    const linkStylesheet = document.querySelector('link[rel=stylesheet]:not(#font)');
    if (linkStylesheet) {
        return createDevThemeSwitcher(defaultGlobalTheme, linkStylesheet);
    }

    const styleSheet = document.querySelector('style');
    if (styleSheet) {
        return createProdThemeSwitcher(defaultGlobalTheme, styleSheet);
    }
    return undefined;
}
