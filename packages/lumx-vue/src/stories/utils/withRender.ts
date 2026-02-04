/**
 * Generate a template string for Storybook stories.
 *
 * @param componentName - The name of the Vue component (e.g., 'DefaultVue')
 * @param slot - Optional slot content (e.g., '{{ args.children }}', '{{ args.label }}')
 * @returns Template string for use in story render functions
 *
 * @example
 * // Self-closing component (no slot)
 * withTemplate('IconButtonBaseVue')
 * // Returns: '<IconButtonBaseVue v-bind="args" />'
 *
 * @example
 * // Component with children slot
 * withTemplate('DefaultVue', '{{ args.children }}')
 * // Returns: '<DefaultVue v-bind="args">{{ args.children }}</DefaultVue>'
 *
 * @example
 * // Component with label slot
 * withTemplate('DefaultVue', '{{ args.label }}')
 * // Returns: '<DefaultVue v-bind="args">{{ args.label }}</DefaultVue>'
 */
export const withTemplate = (componentName: string, slot?: string): string => {
    if (slot) {
        return `<${componentName} v-bind="args">${slot}</${componentName}>`;
    }
    return `<${componentName} v-bind="args" />`;
};

/**
 * Generate a complete render function for Storybook stories.
 *
 * @param component - Object with component name as key and component as value (e.g., { DefaultVue })
 * @param slot - Optional slot content (e.g., '{{ args.children }}', '{{ args.label }}')
 * @returns Render function for use in story definitions
 *
 * @example
 * // Self-closing component (no slot)
 * import IconButtonBaseVue from './Stories/IconButtonBase.vue';
 * render: withRender({ IconButtonBaseVue })
 *
 * @example
 * // Component with children slot
 * import DefaultVue from './Stories/Default.vue';
 * render: withRender({ DefaultVue }, '{{ args.children }}')
 *
 * @example
 * // Component with label slot
 * import DefaultVue from './Stories/Default.vue';
 * render: withRender({ DefaultVue }, '{{ args.label }}')
 */
export const withRender = (component: Record<string, any>, slot?: string) => (args: any) => {
    const componentName = Object.keys(component)[0];
    const componentValue = Object.values(component)[0];

    return {
        components: { [componentName]: componentValue },
        setup() {
            return { args };
        },
        template: withTemplate(componentName, slot),
    };
};
