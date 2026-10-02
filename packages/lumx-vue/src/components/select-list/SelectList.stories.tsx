import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/SelectList/Stories';

import { SelectList } from '.';
import StoryCustomRender from './Stories/CustomRender.vue';

const { meta, ...stories } = setup({
    components: { SelectList },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/select-list/SelectList',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithSelectedValue = { ...stories.WithSelectedValue };
export const WithSections = { ...stories.WithSections };
export const MultipleSelection = { ...stories.MultipleSelection };
export const Loading = { ...stories.Loading };
export const LoadingMore = { ...stories.LoadingMore };
export const ErrorState = { ...stories.ErrorState };
export const EmptyState = { ...stories.EmptyState };
export const Width = { ...stories.Width };

// ── Vue-specific stories (scoped slots + stateful behavior) ──

/** Custom option rendering (`#option` slot) and section title rendering (`#sectionTitle` slot) */
export const CustomRender = {
    render: () => ({
        components: { StoryCustomRender },
        template: '<StoryCustomRender />',
    }),
};
