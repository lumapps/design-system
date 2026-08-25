import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';

import { DEFAULT_PROPS } from '.';
import { Elevation } from '../../types';

/**
 * Setup Card stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component: Card,
}: SetupStoriesOptions<{
    decorators?: never;
}>) {
    return {
        meta: {
            component: Card,
            render: (args: any) => <Card {...args}>Card content</Card>,
            args: DEFAULT_PROPS,
            argTypes: {
                elevation: getSelectArgType<Elevation>([1, 2, 3, 4, 5]),
            },
        },

        /** Default card */
        Default: {},

        /** Elevated card */
        Elevation: { args: { elevation: 3 } },

        /** Card rendered as a custom element */
        AsElement: { args: { as: 'article' } },
    };
}
