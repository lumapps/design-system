import { mdiEmail } from '@lumx/icons';
import { Size, ColorPalette, ColorVariant } from '@lumx/core/js/constants';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { ICON_SIZES } from './constants';

/**
 * Setup Icon stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    decorators: { withCombinations },
    overrides = {},
}: SetupStoriesOptions<{ overrides: 'SizeAndShape' | 'AllColors' | 'InsideText'; decorators: 'withCombinations' }>) {
    return {
        meta: {
            component,
            argTypes: {
                icon: iconArgType,
                hasShape: { control: 'boolean' },
                size: getSelectArgType(ICON_SIZES, 'inline-radio'),
                color: colorArgType,
                colorVariant: colorVariantArgType,
            },
        },

        /** All combinations of size and shape */
        SizeAndShape: {
            args: {
                icon: mdiEmail,
            },
            argTypes: {
                hasShape: { control: false },
                size: { control: false },
            },
            decorators: [
                withCombinations({
                    combinations: {
                        cols: { key: 'size', options: withUndefined(ICON_SIZES) },
                        rows: {
                            Default: {},
                            'Has shape': { hasShape: true },
                        },
                    },
                }),
            ],
        },

        /** All combinations of color and color variants */
        AllColors: {
            args: {
                size: Size.m,
                icon: mdiEmail,
            },
            argTypes: {
                hasShape: { control: false },
                color: { control: false },
                colorVariant: { control: false },
            },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'color', options: withUndefined(ColorPalette) },
                        cols: { key: 'colorVariant', options: withUndefined(ColorVariant) },
                        sections: {
                            Default: {},
                            'Has shape': { hasShape: true },
                        },
                    },
                }),
            ],
        },

        /** Icon inside a text component (renders as inline instead of block and can adapt to the verticalAlign) */
        InsideText: {
            args: {
                icon: mdiEmail,
                size: 'm',
                ...overrides.InsideText?.args,
            },
            argTypes: {
                verticalAlign: { control: 'inline-radio', options: [undefined, 'middle'] },
            },
            ...overrides.InsideText,
        },
    };
}
