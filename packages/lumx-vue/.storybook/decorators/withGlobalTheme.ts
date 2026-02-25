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

            // Call story() once during setup to get a stable component reference.
            // Calling it inside the render function would create new component definitions
            // on every render, causing Vue to unmount/remount and potentially triggering
            // infinite recursive updates.
            const storyComponent = story();
            return () => h(storyComponent);
        },
    };
};
