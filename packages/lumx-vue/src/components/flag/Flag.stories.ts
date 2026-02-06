import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { setup } from '@lumx/core/js/components/Flag/Stories';

import { Flag } from '@lumx/vue';
import FlagDefaultVue from './Stories/FlagDefault.vue';

const { meta, Default, WithIcon, AllColors, Truncate } = setup({
    component: Flag,
    render: withRender({ FlagDefaultVue }, '{{ args.label }}'),
    decorators: { withWrapper, withCombinations, withResizableBox },
});

export default {
    title: 'LumX components/flag/Flag',
    ...meta,
};

export { Default, WithIcon, AllColors, Truncate };
