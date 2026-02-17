import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { DEFAULT_PROPS } from '.';

export function setup({
    component,
    render,
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'WithBefore' | 'WithAfter' | 'WithAll';
    decorators?: never;
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                label: { control: 'text' },
                before: { control: false },
                after: { control: false },
            },
            args: {
                ...DEFAULT_PROPS,
            },
        },

        /** Default toolbar with label */
        Default: {
            args: {
                label: 'Toolbar label',
            },
        },

        /** Toolbar with before content */
        WithBefore: {
            ...overrides.WithBefore,
        },

        /** Toolbar with after content */
        WithAfter: {
            ...overrides.WithAfter,
        },

        /** Toolbar with all content areas */
        WithAll: {
            ...overrides.WithAll,
        },
    };
}
