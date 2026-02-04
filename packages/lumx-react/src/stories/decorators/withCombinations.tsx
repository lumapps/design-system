import { Heading, HeadingLevelProvider } from '@lumx/react';
import { CombinationsOptions } from '@lumx/core/stories/utils/combinations';
import { CombinationsTable } from '@lumx/core/stories/utils/CombinationsTable';

// Re-export types for convenience
export type { CombinationsOptions, Combination, PropEntry } from '@lumx/core/stories/utils/combinations';

/**
 * SB decorator generating a tables of combination of props (max 3 levels of props)
 */
export const withCombinations = (options: CombinationsOptions) => (Story: any, ctx: any) => {
    return (
        <CombinationsTable ctx={ctx} options={options} nestedComponents={{ HeadingLevelProvider, Heading, Story }} />
    );
};
