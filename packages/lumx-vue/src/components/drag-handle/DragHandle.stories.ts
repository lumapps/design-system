import { DragHandle } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/DragHandle/Stories';

const { meta, ...stories } = setup({
    component: DragHandle,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/drag-handle/DragHandle',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllThemes = { ...stories.AllThemes };
