import { defineComponent, provide } from 'vue';

export const ResetTheme = defineComponent({
    name: 'ResetTheme',
    setup(_, { slots }) {
        provide('theme', undefined);
        return () => slots.default?.();
    },
});
