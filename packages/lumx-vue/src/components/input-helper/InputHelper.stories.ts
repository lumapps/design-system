import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/InputHelper/Stories';

import { InputHelper } from '@lumx/vue';
import InputHelperDefaultVue from './Stories/InputHelperDefault.vue';

const { meta, Default, AllKinds } = setup({
    component: InputHelper,
    render: withRender({ InputHelperDefaultVue }, '{{ args.children }}'),
    decorators: { withWrapper, withCombinations },
});

export default {
    title: 'LumX components/input-helper/Input Helper',
    ...meta,
};

export { Default, AllKinds };
