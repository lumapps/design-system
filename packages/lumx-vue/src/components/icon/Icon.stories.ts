import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Icon/Stories';

import { Icon } from '@lumx/vue';
import IconInsideTextVue from './Stories/IconInsideText.vue';

const { meta, SizeAndShape, AllColors, InsideText } = setup({
    component: Icon,
    decorators: { withWrapper, withCombinations },
    overrides: {
        InsideText: { render: withRender({ IconInsideTextVue }) },
    },
});

export default {
    title: 'LumX components/icon/Icon',
    ...meta,
};

export { SizeAndShape, AllColors, InsideText };
