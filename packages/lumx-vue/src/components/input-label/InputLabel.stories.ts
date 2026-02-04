import {
    Default as DefaultStory,
    IsRequired as IsRequiredStory,
    WithCustomTypography as WithCustomTypographyStory,
} from '@lumx/core/js/components/InputLabel/Stories';
import { InputLabel } from '@lumx/vue';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import InputLabelDefaultVue from './Stories/InputLabelDefault.vue';

export default {
    title: 'LumX components/input-label/Input Label',
    component: InputLabel,
    args: {
        ...InputLabel.defaultProps,
        ...DefaultStory.args,
    },
    argTypes: DefaultStory.argTypes,
};

export const Default = {
    ...DefaultStory,
    render: withRender({ InputLabelDefaultVue }, '{{ args.children }}'),
};

export const IsRequired = {
    ...IsRequiredStory,
    render: Default.render,
};

export const WithCustomTypography = {
    ...WithCustomTypographyStory,
    render: Default.render,
};
