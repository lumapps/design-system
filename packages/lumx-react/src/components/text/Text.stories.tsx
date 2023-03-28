import { ALL_TYPOGRAPHY, allTypographyArgType } from '@lumx/react/stories/controls/typography';
import React from 'react';

import { colorArgType, colorVariantArgType } from '@lumx/react/stories/controls/color';
import { textElementArgType } from '@lumx/react/stories/controls/element';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { ColorPalette, ColorVariant, Icon } from '@lumx/react';
import { mdiEarth, mdiHeart } from '@lumx/icons';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';

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
