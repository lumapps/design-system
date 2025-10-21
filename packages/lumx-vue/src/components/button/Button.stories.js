import ButtonVue from './Button.vue';

export default {
    title: 'LumX/Vue/Button',
    component: ButtonVue,
    argTypes: {
        // Define controls for props if needed
    },
};

const Template = (args) => ({
    components: { ButtonVue },
    setup() {
        return { args };
    },
    template: '<ButtonVue v-bind="args">Button</ButtonVue>',
});

export const Default = Template.bind({});
Default.args = {
    // Add default prop values if needed
};
