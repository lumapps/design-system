import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/vue/stories/decorators/withThemedBackground';
import { setup } from '@lumx/core/js/components/Button/Stories';

import { Button } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Button,
    decorators: { withCombinations, withThemedBackground },
});

export default {
    title: 'LumX components/button/Button',
    ...meta,
};

export const Base = { ...stories.Base };
export const SizeAndEmphasis = { ...stories.SizeAndEmphasis };
export const LinkButton = { ...stories.LinkButton };
export const StateVariations = { ...stories.StateVariations };
