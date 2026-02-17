import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { Typography } from '../../constants';

/**
 * Setup InputLabel stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({ component: InputLabel }: SetupStoriesOptions) {
    return {
        meta: {
            component: InputLabel,
            render: ({ children, ...args }: any) => <InputLabel {...args}>{children}</InputLabel>,
            args: {
                children: 'Label text',
            },
            argTypes: {
                isRequired: { control: 'boolean' },
            },
        },

        /** Default input label */
        Default: {},

        /** Required input label */
        IsRequired: {
            args: { isRequired: true },
        },

        /** Default input label with custom typography */
        WithCustomTypography: {
            args: { typography: Typography.subtitle1 },
        },
    };
}
