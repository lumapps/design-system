import { setup } from '@lumx/core/js/components/SelectTextField/TestStories';
import { SelectTextField } from '.';
import { Combobox } from '../combobox';

import StoryWithInfiniteScroll from './Stories/WithInfiniteScroll.vue';
import StoryWithManyOptions from './Stories/WithManyOptions.vue';

const { meta, ...testStories } = setup({
    components: { SelectTextField, Combobox },
});

export default { ...meta, title: 'LumX components/select-text-field/SelectTextField/Tests' };

export const ClickOutsideCloses = { ...testStories.ClickOutsideCloses };
export const BlurResetsToSelectedValue = { ...testStories.BlurResetsToSelectedValue };
export const BlurResetsToEmpty = { ...testStories.BlurResetsToEmpty };
export const MultiBlurResetsSearch = { ...testStories.MultiBlurResetsSearch };

// Vue-specific test stories (use Vue SFCs for stateful rendering)

/** Test infinite scroll loads more options when scrolling to the bottom */
export const WithInfiniteScroll = {
    ...testStories.WithInfiniteScroll,
    render: () => ({
        components: { StoryWithInfiniteScroll },
        template: '<StoryWithInfiniteScroll />',
    }),
};

/** Test that a large (200) option list renders and can be scrolled through */
export const WithManyOptions = {
    ...testStories.WithManyOptions,
    render: (args: { optionsCount: number }) => ({
        components: { StoryWithManyOptions },
        setup() {
            return { args };
        },
        template: '<StoryWithManyOptions v-bind="args" />',
    }),
};
