import { h } from 'vue';
import { CombinationsOptions } from '@lumx/core/stories/utils/combinations';
import { CombinationsTable } from '@lumx/core/stories/utils/CombinationsTable';
import { Heading, HeadingLevelProvider } from '@lumx/vue';

// Re-export types for convenience
export type { CombinationsOptions, Combination, PropEntry } from '@lumx/core/stories/utils/combinations';

/**
 * SB decorator generating a tables of combination of props (max 3 levels of props)
 */
export const withCombinations = (options: CombinationsOptions) => (story: any, ctx: any) => {
    // Render each cell by calling story() with per-cell args.
    // Storybook's Vue renderer mutates context.args via Object.assign when story() is called
    // with an update, so we snapshot and restore ctx.args around each call to prevent
    // args from accumulating across cells.
    const Story = ({ args }: { args: Record<string, any> }) => {
        const savedArgs = ctx.args;
        ctx.args = { ...args };
        const StoryComponent = story({ args });
        ctx.args = savedArgs;
        return h(StoryComponent);
    };
    const nestedComponents = { HeadingLevelProvider, Heading, Story };

    return () => <CombinationsTable ctx={ctx} options={options} nestedComponents={nestedComponents} />;
};
