import { allTypographyArgType, ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { textElementArgType } from '@lumx/core/stories/controls/element';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { ColorPalette, ColorVariant, WhiteSpace } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { DEFAULT_PROPS } from '.';

/** Shared argTypes for Text (also reused by Heading) */
export const TEXT_ARG_TYPES = {
    as: textElementArgType,
    typography: allTypographyArgType,
    color: colorArgType,
    colorVariant: colorVariantArgType,
    whiteSpace: getSelectArgType(WhiteSpace),
};

/**
 * Setup Text stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations, withResizableBox },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'TestUpdateTruncateTitleLabel' | 'WithIcon';
    decorators: 'withCombinations' | 'withResizableBox';
}>) {
    return {
        meta: {
            component,
            render,
            args: {
                ...DEFAULT_PROPS,
                as: 'p',
                children: 'Some text',
            },
            argTypes: TEXT_ARG_TYPES,
        },

        /** Default text component as a paragraph */
        Base: {},

        /** Long text should wrap by default */
        LongText: {
            args: {
                children: loremIpsum('tiny'),
            },
            decorators: [withResizableBox()],
        },

        /** Long text without wrapping */
        NoWrap: {
            args: {
                children: loremIpsum('tiny'),
                noWrap: true,
            },
        },

        /** Long text with line breaks */
        AllWhiteSpace: {
            args: {
                children: `
        But ere she from the church-door stepped She smiled and told us why: 'It was a wicked woman's curse,' Quoth she,
        'and what care I?' She smiled, and smiled, and passed it off Ere from the door she stept—
      `,
            },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'whiteSpace', options: Object.values(WhiteSpace) },
                    },
                    tableStyle: { width: 500, tableLayout: 'fixed' },
                    firstColStyle: { width: 100 },
                    cellStyle: { border: '1px solid #000', width: '100%' },
                }),
            ],
        },

        /** Long text with single line truncate ellipsis */
        Truncate: {
            args: {
                children: loremIpsum('tiny'),
                truncate: true,
            },
        },

        /** Long text with multi line truncate ellipsis */
        TruncateMultiline: {
            args: {
                children: loremIpsum('tiny'),
                truncate: { lines: 2 },
            },
        },

        /** Text containing icons (should match font size) */
        WithIcon: {
            ...overrides.WithIcon,
        },

        /** All typographies */
        AllTypography: {
            argTypes: {
                typography: { control: false },
            },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'typography', options: withUndefined(ALL_TYPOGRAPHY) },
                    },
                }),
            ],
            ...overrides.WithIcon,
        },

        /** All combinations of color and color variants */
        AllColors: {
            argTypes: {
                color: { control: false },
                colorVariant: { control: false },
            },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'color', options: withUndefined(ColorPalette) },
                        cols: { key: 'colorVariant', options: withUndefined(ColorVariant) },
                    },
                }),
            ],
            ...overrides.WithIcon,
        },

        /** Test the update of the `title` attribute when text overflows */
        TestUpdateTruncateTitleLabel: {
            // Disables Chromatic snapshot (not relevant for this story).
            parameters: { chromatic: { disable: true } },
            tags: ['!snapshot'],
            ...overrides.TestUpdateTruncateTitleLabel,
        },
    };
}
