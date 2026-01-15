import { Default, IsRequired, WithCustomTypography } from '@lumx/core/js/components/InputLabel/Stories';
import { InputLabel } from '@lumx/vue';

export default {
    title: 'LumX components/input-label/Input Label',
    component: InputLabel,
    args: {
        ...InputLabel.defaultProps,
        ...Default.args,
    },
    argTypes: Default.argTypes,
};

export { Default, IsRequired, WithCustomTypography };
