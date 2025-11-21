import { useCallback, useState } from 'react';
import { Switch } from '@lumx/react/components/switch';
import { Alignment } from '@lumx/react';

// Global state used to
const globalState = {
    isEnabled: false,
    styleSheet: null as any,
};

/** Toggle apply the material CSS override. */
export async function toggleMaterialTheme(wasEnabled: boolean) {
    globalState.isEnabled = !wasEnabled;

    // Inject the material theme CSS file.
    if (!globalState.styleSheet) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const cssCode = await import('!!raw-loader!@lumx/core/css/material.css');

        // Inject CSS override in a <style> node in <head>
        const style = document.createElement('style');
        style.textContent = cssCode.default;
        document.head.appendChild(style);

        globalState.styleSheet = style.sheet;
    }
    // Disable/Enable stylesheet
    globalState.styleSheet.disabled = !globalState.isEnabled;
}

export const MaterialThemeSwitcher: React.FC<any> = ({ theme }) => {
    const [isEnabled, setEnabled] = useState(globalState.isEnabled);
    const toggleTheme = useCallback(
        () =>
            setEnabled((wasEnabled) => {
                toggleMaterialTheme(wasEnabled);
                return !wasEnabled;
            }),
        [],
    );

    return (
        <Switch
            className="material-theme-switcher"
            isChecked={isEnabled}
            onChange={toggleTheme}
            position={Alignment.right}
            theme={theme}
        >
            Material theme
        </Switch>
    );
};
