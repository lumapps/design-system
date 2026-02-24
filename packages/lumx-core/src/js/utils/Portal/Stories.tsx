import { initDemoShadowDOMPortal } from '@lumx/core/stories/utils/initDemoShadowDOMPortal';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Setup PortalProvider stories for a specific framework (React or Vue).
 * Framework-specific components (Portal, Button) are injected via `components`.
 */
export function setup({
    component: PortalProvider,
    components: { Portal, Button },
}: SetupStoriesOptions<{
    components: { Portal: any; Button: any };
}>) {
    const meta = {
        component: PortalProvider,
        args: { enabled: true },
        parameters: { chromatic: { disable: true } },
        // No need to snapshot these stories
        tags: ['!snapshot'],
    };

    /**
     * Demonstrate how to customize portals to render into a custom shadow root
     */
    const RenderInShadowDOM = {
        render: ({ enabled }: { enabled: boolean }) => (
            <PortalProvider value={initDemoShadowDOMPortal}>
                <Portal enabled={enabled}>
                    <Button>My button {!enabled && 'not'} in a shadow DOM portal</Button>
                </Portal>
            </PortalProvider>
        ),
    };

    return { meta, RenderInShadowDOM };
}
