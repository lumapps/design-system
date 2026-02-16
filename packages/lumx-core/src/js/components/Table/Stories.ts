import type { SetupStoriesOptions } from '../../../stories/types';
import { DEFAULT_PROPS } from '.';

export function setup({
    component,
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'Default' | 'WithHeader';
    decorators?: never;
}>) {
    return {
        meta: {
            component,
            args: {
                ...DEFAULT_PROPS,
                hasBefore: false,
                hasDividers: false,
            },
        },

        /** Simple table */
        Default: {
            ...overrides.Default,
        },

        /** Table with header */
        WithHeader: {
            ...overrides.WithHeader,
        },
    };
}
