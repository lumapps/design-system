import { h, provide, ref, watchEffect } from 'vue';

// Global theme ref
const theme = ref<undefined | string>();

export const withGlobalTheme = (story: any, context: any) => {
    theme.value = context.args?.theme || context.globals?.theme || undefined;
    return {
        setup() {
            provide('theme', theme);

            // Update document with 'theme-dark' class
            watchEffect(() => {
                document.documentElement.classList.toggle('theme-dark', theme.value === 'dark');
            });

            return () => h(story());
        },
    };
};
