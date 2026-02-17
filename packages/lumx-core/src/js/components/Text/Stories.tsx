import { allTypographyArgType, ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { textElementArgType } from '@lumx/core/stories/controls/element';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { ColorPalette, ColorVariant, WhiteSpace } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mdiEarth, mdiHeart } from '@lumx/icons';
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
 * Framework-specific components (Icon) are injected via `components`.
 */
export function setup({
    component: Text,
    components: { Icon },
    decorators: { withCombinations, withResizableBox },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'TestUpdateTruncateTitleLabel';
    decorators: 'withCombinations' | 'withResizableBox';
    components: { Icon: any };
}>) {
    const meta = {
        component: Text,
        render: ({ children, ...args }: any) => <Text {...args}>{children}</Text>,
        args: {
            ...DEFAULT_PROPS,
            as: 'p',
            children: 'Some text',
        },
        argTypes: TEXT_ARG_TYPES,
    };

    /** Default text component as a paragraph */
    const Base = {};

    /** Long text should wrap by default */
    const LongText = {
        args: {
            children: loremIpsum('tiny'),
        },
        decorators: [withResizableBox()],
    };

    /** Long text without wrapping */
    const NoWrap = {
        args: {
            children: loremIpsum('tiny'),
            noWrap: true,
        },
    };

    /** Long text with line breaks */
    const AllWhiteSpace = {
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
                tableStyle: { width: '500px', tableLayout: 'fixed' },
                firstColStyle: { width: '100px' },
                cellStyle: { border: '1px solid #000', width: '100%' },
            }),
        ],
    };

    /** Long text with single line truncate ellipsis */
    const Truncate = {
        args: {
            children: loremIpsum('tiny'),
            truncate: true,
        },
    };

    /** Long text with multi line truncate ellipsis */
    const TruncateMultiline = {
        args: {
            children: loremIpsum('tiny'),
            truncate: { lines: 2 },
        },
    };

    /** Text containing icons (should match font size) */
    const WithIcon = {
        render: ({ children, ...args }: any) => (
            <Text {...args}>
                Some text <Icon icon={mdiHeart} /> with icons <Icon icon={mdiEarth} />
            </Text>
        ),
    };

    /** All typographies */
    const AllTypography = {
        render: WithIcon.render,
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
    };

    /** All combinations of color and color variants */
    const AllColors = {
        render: WithIcon.render,
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
    };

    /** Test the update of the `title` attribute when text overflows */
    const TestUpdateTruncateTitleLabel = {
        args: { children: undefined },
        // Disables Chromatic snapshot (not relevant for this story).
        parameters: { chromatic: { disable: true } },
        tags: ['!snapshot'],
        ...overrides.TestUpdateTruncateTitleLabel,
    };

    return {
        meta,
        Base,
        LongText,
        NoWrap,
        AllWhiteSpace,
        Truncate,
        TruncateMultiline,
        WithIcon,
        AllTypography,
        AllColors,
        TestUpdateTruncateTitleLabel,
    };
}
