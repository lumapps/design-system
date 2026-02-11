import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/vue/stories/decorators/withThemedBackground';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Button/Stories';

import { Button } from '@lumx/vue';
import ButtonBaseVue from './Stories/ButtonBase.vue';

const { meta, ...stories } = setup({
    component: Button,
    render: withRender({ ButtonBaseVue }, '{{ args.children }}'),
    decorators: { withWrapper, withCombinations, withThemedBackground },
});

export default {
    title: 'LumX components/button/Button',
    ...meta,
};

export const Base = { ...stories.Base };
export const SizeAndEmphasis = { ...stories.SizeAndEmphasis };
export const LinkButton = { ...stories.LinkButton };
export const StateVariations = { ...stories.StateVariations };
