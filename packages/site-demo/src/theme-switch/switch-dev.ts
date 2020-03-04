import { Theme } from '@lumx/demo/context/theme';

const getThemeId = (theme: string) => `theme-${theme}`;

const getThemeElement = (theme: Theme) => document.getElementById(getThemeId(theme));

// Cache of theme script URL by theme.
const devThemeScripts: Record<Theme, string | null> = {
    lumapps: null,
    material: null,
};

function initDevThemeScript() {
    if (devThemeScripts[Theme.material] || devThemeScripts[Theme.lumapps]) {
        return;
    }

    const themeMaterial = getThemeElement(Theme.material) as HTMLScriptElement;
    devThemeScripts[Theme.material] = themeMaterial.src;
    const themeLumapps = getThemeElement(Theme.lumapps) as HTMLScriptElement;
    devThemeScripts[Theme.lumapps] = themeLumapps.src;
}

const injectThemeScript = async (theme: Theme) =>
    new Promise((resolve, reject) => {
        const newScript = document.createElement('script');
        newScript.id = getThemeId(theme);
        document.body.append(newScript);
        newScript.addEventListener('load', resolve);
        newScript.addEventListener('error', reject);
        newScript.charset = 'UTF-8';
        newScript.src = devThemeScripts[theme] as string;
    });

function cleanUpOldStyles(newTheme: Theme) {
    let currentStyleFound = false;
    Array.from(document.getElementsByTagName('style'))
        .reverse()
        .map((style) => {
            if (!style.textContent) {
                style.remove();
            }
            if (!currentStyleFound && style.textContent?.includes(`/** DEMO THEME - ${newTheme.toUpperCase()} */`)) {
                currentStyleFound = true;
            } else if (currentStyleFound && style.textContent?.includes(`/** DEMO THEME`)) {
                style.remove();
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
export async function switchDevTheme(oldTheme: Theme, newTheme: Theme) {
    initDevThemeScript();
    const oldThemeElement = getThemeElement(oldTheme);
    const newThemeElement = getThemeElement(newTheme);
    oldThemeElement?.remove();
    newThemeElement?.remove();

    await injectThemeScript(newTheme);
    cleanUpOldStyles(newTheme);
}
