import { GlobalTheme } from '@lumx/core/js/types';

const DELAY_THEME_DISABLE = 200;

export function createGlobalThemeSwitcher(defaultGlobalTheme: GlobalTheme) {
    const linkStylesheet = document.querySelector('link[rel=stylesheet]:not(#font)');
    if (linkStylesheet) {
        return createDevThemeSwitcher(defaultGlobalTheme, linkStylesheet);
    }

    const styleSheet = document.querySelector('style');
    if (styleSheet) {
        return createProdThemeSwitcher(defaultGlobalTheme, styleSheet);
    }
}

/**
 * In development both themes are loaded in <link> that need to be disabled.
 */
function createDevThemeSwitcher(defaultGlobalTheme: GlobalTheme, defaultLinkStylesheet: any) {
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
                otherLinkStylesheet = document.querySelectorAll('link[rel=stylesheet]:not(#font)')[1];
            }
            otherLinkStylesheet.disabled = false;
            setTimeout(() => {
                defaultLinkStylesheet.disabled = true;
            }, DELAY_THEME_DISABLE);
        } else {
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
function createProdThemeSwitcher(defaultGlobalTheme: GlobalTheme, defaultStylesheet: any) {
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
                otherLinkStylesheet = document.querySelectorAll('link[rel=stylesheet]:not(#font)')[0];
            }
            otherLinkStylesheet.disabled = false;
            setTimeout(() => {
                defaultStylesheet.parentNode.removeChild(defaultStylesheet);
            }, DELAY_THEME_DISABLE);
        } else {
            document.head.appendChild(defaultStylesheet);
            setTimeout(() => {
                if (otherLinkStylesheet) {
                    otherLinkStylesheet.disabled = true;
                }
            }, DELAY_THEME_DISABLE);
        }
    };
}
