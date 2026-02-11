import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { DEFAULT_PROPS } from '.';

/**
 * Setup Divider stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
}: SetupStoriesOptions<{
    decorators?: never;
}>) {
    return {
        meta: {
            component,
            render,
            args: {
                ...DEFAULT_PROPS,
            },
        },

        /** Default divider */
        Default: {},
    };
}
