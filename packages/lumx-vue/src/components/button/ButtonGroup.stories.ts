import { ButtonGroup } from '@lumx/vue';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Button/ButtonGroupStories';
import ButtonGroupVariantsVue from './Stories/ButtonGroupVariants.vue';
import ButtonOneButtonVue from './Stories/ButtonOneButton.vue';
import ButtonManyButtonsVue from './Stories/ButtonManyButtons.vue';

const { meta, Variants, OneButton, ManyButtons } = setup({
    component: ButtonGroup,
    decorators: { withCombinations },
    overrides: {
        Variants: {
            render: withRender({ ButtonGroupVariantsVue }),
        },
        OneButton: {
            render: withRender({ ButtonOneButtonVue }),
        },
        ManyButtons: {
            render: withRender({ ButtonManyButtonsVue }),
        },
    },
});

export default {
    title: 'LumX components/button/ButtonGroup',
    ...meta,
};

export { Variants, OneButton, ManyButtons };
