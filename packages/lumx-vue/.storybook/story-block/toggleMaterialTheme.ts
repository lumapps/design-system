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
        const cssCode = await import('@lumx/core/css/material.css?raw');

        // Inject CSS override in a <style> node in <head>
        const style = document.createElement('style');
        style.textContent = cssCode.default;
        document.head.appendChild(style);

        globalState.styleSheet = style.sheet;
    }
    // Disable/Enable stylesheet
    globalState.styleSheet.disabled = !globalState.isEnabled;
}
