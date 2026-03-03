import { Chip, ChipGroup } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Chip/ChipGroupStories';

const { meta, ...stories } = setup({
    component: ChipGroup,
    components: { Chip },
});

export default {
    title: 'LumX components/chip/ChipGroup',
    ...meta,
};

export const Default = { ...stories.Default };
export const Small = { ...stories.Small };
