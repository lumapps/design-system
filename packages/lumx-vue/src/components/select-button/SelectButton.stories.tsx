import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/SelectButton/Stories';

import { SelectButton } from '.';

import StoryCustomRender from './Stories/CustomRender.vue';

const { meta, ...stories } = setup({
    components: { SelectButton },
    decorators: { withValueOnChange, withCombinations },
});

export default {
    title: 'LumX components/select-button/SelectButton',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithSelectedValue = { ...stories.WithSelectedValue };
export const WithSections = { ...stories.WithSections };
export const WithDescriptions = { ...stories.WithDescriptions };
export const Disabled = { ...stories.Disabled };
export const Loading = { ...stories.Loading };
export const LoadingMore = { ...stories.LoadingMore };
export const ErrorState = { ...stories.ErrorState };
export const MultipleSelection = { ...stories.MultipleSelection };
export const MultipleWithPreselected = { ...stories.MultipleWithPreselected };
export const WithNbOptionMessage = { ...stories.WithNbOptionMessage };
export const LabelDisplayModes = { ...stories.LabelDisplayModes };

// ── Vue-specific stories (scoped slots + stateful behavior) ──

/** SelectButton with a custom trigger (`#button` slot) and custom option rendering (`#option` slot) */
export const CustomRender = {
    render: () => ({
        components: { StoryCustomRender },
        template: '<StoryCustomRender />',
    }),
};
