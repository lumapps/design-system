import { SelectionChipGroup } from '@lumx/vue';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/Chip/SelectionChipGroupStories';
import StoryCustomRender from './Stories/CustomRender.vue';
import StoryInTextField from './Stories/InTextField.vue';

const { meta, ...stories } = setup({
    component: SelectionChipGroup,
    decorators: { withValueOnChange, withResizableBox },
});

export default {
    title: 'LumX components/chip/SelectionChipGroup',
    ...meta,
};

export const Default = { ...stories.Default };
export const Disabled = { ...stories.Disabled };
export const IndividuallyDisabled = { ...stories.IndividuallyDisabled };
export const Empty = { ...stories.Empty };
export const ConstrainedSpace = { ...stories.ConstrainedSpace };

/** Selection chip group with custom chip render */
export const CustomRender = {
    render: () => ({
        components: { StoryCustomRender },
        template: '<StoryCustomRender />',
    }),
};

/** Selection chip group inside a TextField chips slot with inputRef for keyboard navigation */
export const InTextField = {
    render: () => ({
        components: { StoryInTextField },
        template: '<StoryInTextField />',
    }),
};
