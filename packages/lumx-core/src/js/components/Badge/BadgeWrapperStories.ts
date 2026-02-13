import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { DEFAULT_PROPS } from './BadgeWrapper';

export function setup({
    component,
    render,
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'WithIcon' | 'WithButton';
    decorators?: never;
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                children: { control: false },
            },
            args: {
                ...DEFAULT_PROPS,
            },
        },

        /** Using badge wrapper with icon */
        WithIcon: {
            ...overrides.WithIcon,
        },

        /** Using badge wrapper with button */
        WithButton: {
            ...overrides.WithButton,
        },
    };
}
