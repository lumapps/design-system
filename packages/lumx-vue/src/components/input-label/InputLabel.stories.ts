import {
    Default as DefaultStory,
    IsRequired as IsRequiredStory,
    WithCustomTypography as WithCustomTypographyStory,
} from '@lumx/core/js/components/InputLabel/Stories';
import { InputLabel, InputLabelProps } from '@lumx/vue';

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
            return { args };
        },
        template: `
            <InputLabel v-bind="args">
                {{ args.children }}
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
