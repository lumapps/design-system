import { allTypographyArgType } from '@lumx/core/stories/controls/typography';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { textElementArgType } from '@lumx/core/stories/controls/element';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { WhiteSpace } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';

import { DEFAULT_PROPS } from '.';

export const Default = {
    args: {
        ...DEFAULT_PROPS,
        children: 'Some text',
    },
    argTypes: {
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
export const Base = {
    args: {
        as: 'p',
        children: 'Some text',
    },
};

/**
 * Long text should wrap by default
 */
export const LongText = {
    args: {
        ...Base.args,
        children: loremIpsum('tiny'),
    },
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
        ...Base.args,
        children: `
        But ere she from the church-door stepped She smiled and told us why: 'It was a wicked woman's curse,' Quoth she,
        'and what care I?' She smiled, and smiled, and passed it off Ere from the door she stept—
      `,
    },
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
    argTypes: {
        typography: { control: false },
    },
};

/**
 * All combinations of color and color variants
 */
export const AllColors = {
    argTypes: {
        color: { control: false },
        colorVariant: { control: false },
    },
};
