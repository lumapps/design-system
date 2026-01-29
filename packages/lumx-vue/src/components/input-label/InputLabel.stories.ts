import {
    Default as DefaultStory,
    IsRequired as IsRequiredStory,
    WithCustomTypography as WithCustomTypographyStory,
} from '@lumx/core/js/components/InputLabel/Stories';
import { InputLabel, InputLabelProps } from '@lumx/vue';
import { cleanArgs } from '@lumx/vue/stories/utils/cleanArgs';

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
    render: (args: InputLabelProps) => ({
        components: { InputLabel },
        setup() {
            return cleanArgs(args);
        },
        template: `
            <InputLabel v-bind="args">
                {{ slot }}
            </InputLabel>
        `,
    }),
};

export const IsRequired = {
    ...IsRequiredStory,
    render: Default.render,
};

export const WithCustomTypography = {
    ...WithCustomTypographyStory,
    render: Default.render,
};
