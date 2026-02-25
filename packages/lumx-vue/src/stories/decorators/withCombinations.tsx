import { defineComponent, h, type PropType } from 'vue';
import { CombinationsOptions } from '@lumx/core/stories/utils/combinations';
import { CombinationsTable } from '@lumx/core/stories/utils/CombinationsTable';
import { Heading, HeadingLevelProvider } from '@lumx/vue';

// Re-export types for convenience
export type { CombinationsOptions, Combination, PropEntry } from '@lumx/core/stories/utils/combinations';

/**
 * SB decorator generating a tables of combination of props (max 3 levels of props)
 */
export const withCombinations = (options: CombinationsOptions) => (story: any, ctx: any) => {
    // Story component that renders a single combination cell.
    // Uses defineComponent so that story() is called once during setup(),
    // producing a stable component reference. Calling story() in the render
    // function would create new component definitions on every render,
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
    const nestedComponents = { HeadingLevelProvider, Heading, Story };

    return () => <CombinationsTable ctx={ctx} options={options} nestedComponents={nestedComponents} />;
};
