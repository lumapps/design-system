import { defineComponent, provide } from 'vue';
import { COMPAT_OPTIONS } from '../compat/compatOptions';

export const ResetTheme = defineComponent({
    ...COMPAT_OPTIONS,
    name: 'ResetTheme',
    setup(_, { slots }) {
        provide('theme', undefined);
        return () => slots.default?.();
    },
});
