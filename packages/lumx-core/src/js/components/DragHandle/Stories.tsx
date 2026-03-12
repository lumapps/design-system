import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { DEFAULT_PROPS } from '.';

export function setup({
    component: DragHandle,
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
}>) {
    const meta = {
        component: DragHandle,
        render: (args: any) => <DragHandle {...args} />,
        args: {
            ...DEFAULT_PROPS,
        },
    };

    /** Default drag handle */
    const Default = {};

    /** All themes */
    const AllThemes = {
        decorators: [
            withCombinations({
                combinations: {
                    cols: { key: 'theme', options: ['light', 'dark'] },
                },
            }),
        ],
    };

    return { meta, Default, AllThemes };
}
