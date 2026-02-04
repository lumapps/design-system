import { ButtonGroup } from '@lumx/vue';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import ButtonOneButtonVue from './Stories/ButtonOneButton.vue';
import ButtonManyButtonsVue from './Stories/ButtonManyButtons.vue';

export default {
    title: 'LumX components/button/ButtonGroup',
    component: ButtonGroup,
    argTypes: { children: { control: false } },
};

export const OneButton = {
    render: withRender({ ButtonOneButtonVue }),
};

export const ManyButtons = {
    render: withRender({ ButtonManyButtonsVue }),
};
