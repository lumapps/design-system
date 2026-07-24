import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { Typography } from '../../constants';

/**
 * Core stories for DialogHeading, shared by React and Vue.
 *
 * Framework-agnostic on purpose: it defines no JSX `render` and no `play`, relying on Storybook's
 * default rendering of the injected `component` from `args`. Each framework only injects its own
 * `DialogHeading` component.
 */
export function setup({ component: DialogHeading }: SetupStoriesOptions) {
    return {
        meta: {
            component: DialogHeading,
            render: ({ children, ...args }: any) => <DialogHeading {...args}>{children}</DialogHeading>,
            args: { children: 'Dialog Heading Text' },
        },

        /**
         * `DialogHeading` renders a `Heading` defaulting to the `title` typography.
         *
         * Rendered inside a `Dialog`, `Lightbox` or `PopoverDialog` it also names the container via
         * `aria-labelledby` — see those components' stories for the integration.
         */
        Default: {
            args: {},
        },

        /** The default `title` typography can be overridden with the `typography` prop. */
        CustomTypography: {
            args: { typography: Typography.headline },
        },
    };
}
