import { Checkbox } from '@lumx/vue';

import {
    Default as DefaultStory,
    Base as BaseStory,
    LabelAndHelper as LabelAndHelperStory,
} from '@lumx/core/js/components/Checkbox/Stories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import CheckboxBase from './Stories/CheckboxBase.vue';

export default {
    title: 'LumX components/checkbox/Checkbox',
    ...DefaultStory,
    component: Checkbox,
};

/**
 * Default checkbox
 */
export const Base = {
    ...BaseStory,
    render: withRender({ CheckboxBase }),
};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    ...LabelAndHelperStory,
    render: withRender({ CheckboxBase }),
};
