import { GlobalTheme } from '@lumx/core/js/types';

const getThemeId = (theme: string) => `theme-${theme}`;

const getThemeElement = (theme: GlobalTheme) => document.getElementById(getThemeId(theme));

// Cache of theme script URL by theme.
const devThemeScripts: Record<GlobalTheme, string | null> = {
    lumapps: null,
    material: null,
};

function initDevThemeScript() {
    if (devThemeScripts.material || devThemeScripts.lumapps) {
        return;
    }

    const themeMaterial = getThemeElement('material') as HTMLScriptElement;
    devThemeScripts.material = themeMaterial.src;
    const themeLumapps = getThemeElement('lumapps') as HTMLScriptElement;
    devThemeScripts.lumapps = themeLumapps.src;
}

const injectThemeScript = async (theme: GlobalTheme) =>
    new Promise((resolve, reject) => {
        const newScript = document.createElement('script');
        newScript.id = getThemeId(theme);
        document.body.appendChild(newScript);
        newScript.addEventListener('load', resolve);
        newScript.addEventListener('error', reject);
        // tslint:disable-next-line: deprecation
        newScript.charset = 'UTF-8';
        newScript.src = devThemeScripts[theme] as string;
    });

function cleanUpOldStyles(newTheme: GlobalTheme) {
    let currentStyleFound = false;
    Array.from(document.getElementsByTagName('style'))
        .reverse()
        .map((style) => {
            if (!style.textContent) {
                style.parentNode?.removeChild?.(style);
            }
            if (!currentStyleFound && style.textContent?.includes(`/** DEMO THEME - ${newTheme.toUpperCase()} */`)) {
                currentStyleFound = true;
            } else if (currentStyleFound && style.textContent?.includes(`/** DEMO THEME`)) {
                style.parentNode?.removeChild?.(style);
            }
        });
}

/**
 * Switch between LumApps/Material theme in development mode. It differs from the production since we need to load styles
 * with the webpack style-loader to have hot code reloading.
 *
 * 1. Remove previously used theme loader scripts
 * 2. Inject the new theme theme loader script
 * 3. Clean up the style node previously generated.
 *
 * @param oldTheme Previously selected theme
 * @param newTheme New theme to apply
 */
export async function switchDevTheme(oldTheme: GlobalTheme, newTheme: GlobalTheme) {
    initDevThemeScript();
    const oldThemeElement = getThemeElement(oldTheme);
    const newThemeElement = getThemeElement(newTheme);

    oldThemeElement?.parentNode?.removeChild(oldThemeElement);
    newThemeElement?.parentNode?.removeChild(newThemeElement);

    await injectThemeScript(newTheme);
    cleanUpOldStyles(newTheme);
}
