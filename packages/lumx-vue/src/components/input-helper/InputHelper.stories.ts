import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/InputHelper/Stories';

import { InputHelper } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: InputHelper,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/input-helper/Input Helper',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllKinds = { ...stories.AllKinds };
