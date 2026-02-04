import { InputHelper } from '@lumx/vue';

import { Default as DefaultConfig, AllKinds as AllKindsStory } from '@lumx/core/js/components/InputHelper/Stories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import InputHelperDefaultVue from './Stories/InputHelperDefault.vue';
import InputHelperAllKindsVue from './Stories/InputHelperAllKinds.vue';

export default {
    title: 'LumX components/input-helper/Input Helper',
    component: InputHelper,
    ...DefaultConfig,
    args: {
        ...DefaultConfig.args,
        children: 'Some helper text',
    },
};

export const Default = {
    render: withRender({ InputHelperDefaultVue }, '{{ args.children }}'),
};

export const AllKinds = {
    ...AllKindsStory,
    render: withRender({ InputHelperAllKindsVue }, '{{ args.children }}'),
};
