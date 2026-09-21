import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/vue/stories/decorators/withThemedBackground';
import { setup } from '@lumx/core/js/components/InputRequiredLegend/Stories';

import { InputRequiredLegend } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: InputRequiredLegend,
    decorators: { withCombinations, withThemedBackground },
});

export default {
    title: 'LumX components/input-required-legend/Input Required Legend',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllThemes = { ...stories.AllThemes };
