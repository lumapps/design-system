import { Theme } from '@lumx/core/js/constants';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Setup InputRequiredLegend stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 */
export function setup({
    component: InputRequiredLegend,
    decorators: { withCombinations, withThemedBackground },
}: SetupStoriesOptions<{ decorators: 'withCombinations' | 'withThemedBackground' }>) {
    return {
        meta: {
            component: InputRequiredLegend,
            render: (args: any) => <InputRequiredLegend {...args} />,
            args: { label: 'Indicates a required field' },
        },

        /** Default required legend */
        Default: {},

        /** All themes */
        AllThemes: {
            argTypes: { theme: { control: false } },
            decorators: [
                withThemedBackground(),
                withCombinations({
                    combinations: {
                        rows: { key: 'theme', options: Object.values(Theme) },
                    },
                }),
            ],
        },
    };
}
