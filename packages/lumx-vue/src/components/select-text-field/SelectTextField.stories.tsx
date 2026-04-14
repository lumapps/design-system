import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/SelectTextField/Stories';

import { SelectTextField } from '.';

import StoryCustomRender from './Stories/CustomRender.vue';
import StoryWithCreatableOptions from './Stories/WithCreatableOptions.vue';
import StoryWithSearch from './Stories/WithSearch.vue';
import StoryMultipleWithSearch from './Stories/MultipleWithSearch.vue';

const { meta, ...stories } = setup({
    components: { SelectTextField },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/select-text-field/SelectTextField',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithSelectedValue = { ...stories.WithSelectedValue };
export const NoClearButton = { ...stories.NoClearButton };
export const WithDescriptions = { ...stories.WithDescriptions };
export const WithSections = { ...stories.WithSections };
export const WithIcon = { ...stories.WithIcon };
export const Disabled = { ...stories.Disabled };
export const WithError = { ...stories.WithError };
export const WithHelper = { ...stories.WithHelper };
export const MultipleSelection = { ...stories.MultipleSelection };
export const MultipleWithPreselected = { ...stories.MultipleWithPreselected };
export const MultipleWithManyChips = { ...stories.MultipleWithManyChips };
export const MultipleDisabled = { ...stories.MultipleDisabled };
export const Loading = { ...stories.Loading };
export const LoadingMore = { ...stories.LoadingMore };
export const ErrorState = { ...stories.ErrorState };

// ── Vue-specific stories (scoped slots + stateful behavior) ──

/** SelectTextField with custom option, section title, and chip rendering via scoped slots */
export const CustomRender = {
    render: () => ({
        components: { StoryCustomRender },
        template: '<StoryCustomRender />',
    }),
};

/** SelectTextField with a creatable option before the list */
export const WithCreatableOptions = {
    render: () => ({
        components: { StoryWithCreatableOptions },
        template: '<StoryWithCreatableOptions />',
    }),
};

/** Single-select with consumer-controlled search (`filter="manual"` + `@search` listener) */
export const WithSearch = {
    render: () => ({
        components: { StoryWithSearch },
        template: '<StoryWithSearch />',
    }),
};

/** Multi-select with consumer-controlled search (`filter="manual"` + `@search` listener) */
export const MultipleWithSearch = {
    render: () => ({
        components: { StoryMultipleWithSearch },
        template: '<StoryMultipleWithSearch />',
    }),
};
