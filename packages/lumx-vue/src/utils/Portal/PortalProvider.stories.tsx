import { Button } from '@lumx/vue/components/button';
import { setup } from '@lumx/core/js/utils/Portal/Stories';
import { PortalProvider } from './PortalProvider';
import { Portal } from './Portal';

const { meta, ...stories } = setup({
    component: PortalProvider,
    components: { Portal, Button },
});

export default { title: 'utils/portal/PortalProvider', ...meta };

export const RenderInShadowDOM = { ...stories.RenderInShadowDOM };
