import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { DEFAULT_PROPS } from '.';

export function setup({
    component,
}: SetupStoriesOptions<{
    decorators?: never;
}>) {
    return {
        meta: {
            component,
            args: DEFAULT_PROPS,
        },

        /** Default progress linear */
        Default: {},
    };
}
