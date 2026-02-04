import { Flag } from '@lumx/vue';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';

import {
    Default as DefaultConfig,
    Base,
    WithIcon as WithIconStory,
    Truncate as TruncateStory,
    AllColors as AllColorsStory,
} from '@lumx/core/js/components/Flag/Stories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import FlagDefaultVue from './Stories/FlagDefault.vue';
import FlagAllColorsVue from './Stories/FlagAllColors.vue';

export default {
    ...DefaultConfig,
    title: 'LumX components/flag/Flag',
    component: Flag,
};

/**
 * Default flag with label
 */
export const Default = {
    ...Base,
    render: withRender({ FlagDefaultVue }, '{{ args.label }}'),
};

/**
 * With icon
 */
export const WithIcon = {
    ...WithIconStory,
    render: Default.render,
};

/**
 * All `color` variants
 */
export const AllColors = {
    ...AllColorsStory,
    render: withRender({ FlagAllColorsVue }, '{{ args.label }}'),
};

/**
 * Truncate text option
 */
export const Truncate = {
    ...Default,
    ...TruncateStory,
    decorators: [withResizableBox()],
};
