import { ButtonGroup, ButtonGroupProps, Button } from '@lumx/vue';

export default {
    title: 'LumX components/button/ButtonGroup',
    component: ButtonGroup,
    argTypes: { children: { control: false } },
};

export const OneButton = {
    render: (args: ButtonGroupProps) => ({
        components: { ButtonGroup, Button },
        setup() {
            return { args };
        },
        template: `
            <ButtonGroup v-bind="args">
                <Button>Button</Button>
            </ButtonGroup>
        `,
    }),
};

export const ManyButtons = {
    render: (args: ButtonGroupProps) => ({
        components: { ButtonGroup, Button },
        setup() {
            return { args };
        },
        template: `
            <ButtonGroup v-bind="args">
                <span class="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 1</Button>
                <span class="visually-hidden">Ignore me</span>
                <Button emphasis="medium">Button 2</Button>
                <span class="visually-hidden">Ignore me</span>
            </ButtonGroup>
        `,
    }),
};
