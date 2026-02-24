import { Button, Tooltip } from '@lumx/vue';
import { withChromaticForceScreenSize } from '@lumx/vue/stories/decorators/withChromaticForceScreenSize';
import { setup } from '@lumx/core/js/components/Tooltip/Stories';

const { meta, ...stories } = setup({
    component: Tooltip,
    components: { Button },
    decorators: { withChromaticForceScreenSize },
});

export default {
    title: 'LumX components/tooltip/Tooltip',
    ...meta,
};

export const OnAButton = { ...stories.OnAButton };
export const OnADisabledButton = { ...stories.OnADisabledButton };
export const ForceOpen = { ...stories.ForceOpen };
export const CloseModeHide = { ...stories.CloseModeHide };
export const MultilineTooltip = { ...stories.MultilineTooltip };
