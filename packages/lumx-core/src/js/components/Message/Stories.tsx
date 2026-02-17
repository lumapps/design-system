import { mdiDelete } from '@lumx/icons';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { Kind } from '../../constants';

/**
 * Setup Message stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component: Message,
    decorators: { withCombinations },
    overrides = {},
}: SetupStoriesOptions<{ overrides: 'ClosableMessage'; decorators: 'withCombinations' }>) {
    return {
        meta: {
            component: Message,
            render: ({ children, ...args }: any) => <Message {...args}>{children}</Message>,
            argTypes: {
                kind: getSelectArgType(Kind),
                hasBackground: { control: 'boolean' },
                icon: iconArgType,
            },
            args: {
                children: loremIpsum('tiny'),
            },
        },

        /** Default message */
        Default: {},

        /** All `kind` variants */
        AllKinds: {
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'kind', options: withUndefined(Kind) },
                    },
                }),
            ],
        },

        /** All `kind` variants with `hasBackground` */
        AllKindsWithBackground: {
            args: {
                hasBackground: true,
            },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'kind', options: withUndefined(Kind) },
                    },
                }),
            ],
        },

        /** With custom icon */
        CustomIcon: {
            args: {
                icon: mdiDelete,
            },
        },

        /** With close button (has background and kind info) */
        ClosableMessage: {
            ...overrides.ClosableMessage,
            args: {
                hasBackground: true,
                kind: 'info',
                ...overrides.ClosableMessage?.args,
            },
        },
    };
}
