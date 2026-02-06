import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/vue/stories/decorators/withThemedBackground';
import { setup } from '@lumx/core/js/components/Button/IconButtonStories';

import { IconButton } from '@lumx/vue';
import IconButtonBaseVue from './Stories/IconButtonBase.vue';

const { meta, Default, WithImage, IconStateVariations } = setup({
    component: IconButton,
    render: withRender({ IconButtonBaseVue }),
    decorators: { withCombinations, withThemedBackground },
});

export default {
    title: 'LumX components/button/IconButton',
    ...meta,
};

export { Default, WithImage, IconStateVariations };
