import { Checkbox } from '@lumx/vue';

import {
    Default as DefaultConfig,
    LabelAndHelper as LabelAndHelperStory,
    IntermediateState as IntermediateStateStory,
    Disabled as DisabledStory,
} from '@lumx/core/js/components/Checkbox/Stories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import CheckboxDefaultVue from './Stories/CheckboxDefault.vue';
import CheckboxDisabledVue from './Stories/CheckboxDisabled.vue';

export default {
    title: 'LumX components/checkbox/Checkbox',
    component: Checkbox,
    ...DefaultConfig,
    args: {
        ...DefaultConfig.args,
        isChecked: undefined, // Let the component manage its own state
    },
    argTypes: {
        ...DefaultConfig.argTypes,
        onChange: { action: 'change' },
        isChecked: { control: false }, // Disable control since state is managed internally
    },
};

/**
 * Default checkbox
 */
export const Default = {
    render: withRender({ CheckboxDefaultVue }),
};

/**
 * With label and helper
 */
export const LabelAndHelper = {
    ...LabelAndHelperStory,
    render: withRender({ CheckboxDefaultVue }),
    args: {
        label: 'Checkbox label',
        helper: loremIpsum('tiny'),
    },
};

/**
 * With intermediate state
 */
export const IntermediateState = {
    ...IntermediateStateStory,
    render: withRender({ CheckboxDefaultVue }),
};

/**
 * Disabled
 */
export const Disabled = {
    ...DisabledStory,
    render: withRender({ CheckboxDisabledVue }),
    args: {
        label: 'Checkbox label',
        helper: 'Checkbox is disabled because...',
    },
};
