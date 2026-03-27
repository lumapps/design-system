import { defineComponent, ref } from 'vue';
import { setup } from '@lumx/core/js/components/SelectButton/TestStories';
import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { SelectButton } from '.';

import StoryWithInfiniteScroll from './Stories/WithInfiniteScroll.vue';

function renderWithState(template: (props: any) => any) {
    const Wrapper = defineComponent({
        setup() {
            const value = ref<any>(undefined);
            return () =>
                template({
                    value: value.value,
                    onChange: (v: any) => {
                        value.value = v;
                    },
                });
        },
    });
    return <Wrapper />;
}

const { meta, ...testStories } = setup({
    components: { SelectButton },
    decorators: { withValueOnChange },
    renderWithState,
});

export default {
    ...meta,
    title: 'LumX components/select-button/SelectButton/Tests',
};

export const ClickOutsideCloses = { ...testStories.ClickOutsideCloses };
export const SelectionUpdates = { ...testStories.SelectionUpdates };

// Vue-specific test stories (use Vue SFCs for stateful rendering)

/** Test infinite scroll loads more options when scrolling to the bottom */
export const WithInfiniteScroll = {
    ...testStories.WithInfiniteScroll,
    render: () => ({
        components: { StoryWithInfiniteScroll },
        template: '<StoryWithInfiniteScroll />',
    }),
};
