import { defineComponent, h, ref, type PropType } from 'vue';
import { FlexBox } from '@lumx/vue';
import {
    prepareThemeData,
    type Entry,
    type ThemeVariablesOptions,
    type Variables,
} from '@lumx/core/stories/utils/themeVariables';
import { ThemingVariablesTable } from '@lumx/core/stories/utils/ThemingVariablesTable';

// Re-export types for convenience
export type { ThemeVariablesOptions, PropertyTree, Entry, Variables } from '@lumx/core/stories/utils/themeVariables';

/**
 * Storybook decorator for theming CSS custom properties (Vue version).
 * Allows interactive editing of design tokens via an "Edit variables" panel.
 *
 * @param options - Configuration object with properties tree and initial values
 * @returns Storybook decorator function
 *
 * @example
 * import pick from 'lodash/pick';
 * import { DESIGN_TOKENS } from '@lumx/core/js/constants/_internal/design-tokens';
 *
 * export const Theming = {
 *     decorators: [
 *         withTheming({
 *             properties: pick(DESIGN_TOKENS, ['chip']),
 *             values: `
 *                 --lumx-chip-emphasis-selected-state-default-theme-light-border-color: red;
 *                 --lumx-chip-emphasis-selected-state-hover-theme-light-border-color: blue;
 *             `,
 *         }),
 *     ],
 * };
 */
export function withTheming(options: ThemeVariablesOptions) {
    return (story: any, ctx: any) => {
        // Prepare theme data using core utility (same as React)
        const { filteredStyles, defaultStyle } = prepareThemeData(options);

        // Vue-specific reactive state
        const style = ref<Variables>(filteredStyles(ctx.args)());

        // Vue-specific event handler
        const handleVariableChange = ([key, value]: Entry) => {
            style.value = { ...style.value, [key]: value };
        };

        // Wrapper component for details element
        const DetailsContainer = defineComponent(
            (props: { children?: any }, { slots }) => {
                return () => <details class="lumx-spacing-margin-vertical-huge">{slots.default?.()}</details>;
            },
            { name: 'DetailsContainer' },
        );

        // Story component that calls story() once during setup to produce a stable component reference.
        // Calling story() in the render function would create new component definitions on every render,
        // causing Vue to unmount/remount and triggering infinite recursive updates.
        const Story = defineComponent(
            (props: { args: Record<string, any> }) => {
                // Snapshot and restore ctx.args around the story() call to prevent
                // Storybook's Vue renderer from accumulating args across cells.
                const savedArgs = ctx.args;
                ctx.args = { ...props.args };
                const StoryComponent = story({ args: props.args });
                ctx.args = savedArgs;
                return () => h(StoryComponent);
            },
            {
                props: {
                    args: { type: Object as PropType<Record<string, any>>, required: true },
                },
            },
        );

        // Return render function (Vue pattern)
        return () => {
            // Merge style into args - this is reactive to style.value changes
            const argsWithStyle = { ...ctx.args, style: { ...ctx.args.style, ...style.value } };

            return (
                <>
                    <Story args={argsWithStyle} />
                    <ThemingVariablesTable
                        style={style.value}
                        defaultStyle={defaultStyle}
                        onVariableChange={handleVariableChange}
                        nestedComponents={{
                            FlexBox,
                            DetailsContainer,
                        }}
                    />
                </>
            );
        };
    };
}
