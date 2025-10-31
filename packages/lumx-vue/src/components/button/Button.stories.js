import ButtonVue from './Button.vue';

export default {
    title: 'LumX/Vue/Button',
    component: ButtonVue,
};

export const Default = () => ({
    components: { ButtonVue },
    template: `<ButtonVue label="Button" />`,
});
