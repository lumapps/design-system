import { Button, ButtonGroup, IconButton } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Button/ButtonGroupStories';

const { meta, ...stories } = setup({
    component: ButtonGroup,
    components: { Button, IconButton },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/button/ButtonGroup',
    ...meta,
};

export const Variants = { ...stories.Variants };
export const OneButton = { ...stories.OneButton };
export const ManyButtons = { ...stories.ManyButtons };
