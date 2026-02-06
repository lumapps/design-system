import { Kind } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { InputHelper } from '.';

/**
 * Setup InputHelper stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations },
}: SetupStoriesOptions<{ decorators: 'withCombinations' }>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                kind: getSelectArgType(Kind),
            },
            args: { ...InputHelper.defaultProps, children: 'Some helper text' },
        },

        /** Default input helper */
        Default: {},

        /** All `kind` variants */
        AllKinds: {
            argTypes: { kind: { control: false } },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'kind', options: withUndefined(Kind) },
                    },
                }),
            ],
        },
    };
}
