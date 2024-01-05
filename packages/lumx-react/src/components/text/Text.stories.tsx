import { ALL_TYPOGRAPHY, allTypographyArgType } from '@lumx/react/stories/controls/typography';
import React from 'react';

import { colorArgType, colorVariantArgType } from '@lumx/react/stories/controls/color';
import { textElementArgType } from '@lumx/react/stories/controls/element';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { ColorPalette, ColorVariant, Icon, WhiteSpace } from '@lumx/react';
import { mdiEarth, mdiHeart } from '@lumx/icons';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';

import { Text } from './Text';

export default {
    title: 'LumX components/text/Text',
    component: Text,
    args: Text.defaultProps,
    argTypes: {
        children: { control: false },
        as: textElementArgType,
        typography: allTypographyArgType,
        color: colorArgType,
        colorVariant: colorVariantArgType,
        whiteSpace: getSelectArgType(WhiteSpace),
    },
};

/**
 * Default text component as a paragraph
 */
export const Default = {
    args: {
        as: 'p',
        children: 'Some text',
    },
};

/**
 * Text containing icons (should match font size)
 */
export const WithIcon = {
    args: {
        ...Default.args,
        children: (
            <>
                Some text <Icon icon={mdiHeart} /> with icons <Icon icon={mdiEarth} />
            </>
        ),
    },
};

/**
 * Long text should wrap by default
 */
export const LongText = {
    args: {
        ...Default.args,
        children: loremIpsum('tiny'),
    },
    decorators: [withResizableBox()],
};

/**
 * Long text without wrapping
 */
export const NoWrap = {
    ...LongText,
    args: {
        ...LongText.args,
        noWrap: true,
    },
};

/**
 * Long text with line breaks
 */
export const AllWhiteSpace = {
    args: {
        ...Default.args,
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
};

/**
 * Long text with single line truncate ellipsis
 */
export const Truncate = {
    ...LongText,
    args: {
        ...LongText.args,
        truncate: true,
    },
};

/**
 * Long text with multi line truncate ellipsis
 */
export const TruncateMultiline = {
    ...LongText,
    args: {
        ...LongText.args,
        truncate: { lines: 2 },
    },
};

/**
 * All typographies
 */
export const AllTypography = {
    ...WithIcon,
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

/**
 * All combinations of color and color variants
 */
export const AllColors = {
    ...WithIcon,
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
