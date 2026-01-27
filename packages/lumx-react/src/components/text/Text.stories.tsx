import React from 'react';

import { ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { Button, ColorPalette, ColorVariant, Icon, WhiteSpace } from '@lumx/react';
import { mdiEarth, mdiHeart } from '@lumx/icons';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';

import {
    Default as DefaultConfig,
    Base as BaseStory,
    LongText as LongTextStory,
    NoWrap as NoWrapStory,
    AllWhiteSpace as AllWhiteSpaceStory,
    Truncate as TruncateStory,
    TruncateMultiline as TruncateMultilineStory,
    AllTypography as AllTypographyStory,
    AllColors as AllColorsStory,
} from '@lumx/core/js/components/Text/Stories';

import { Text } from './Text';

export default {
    title: 'LumX components/text/Text',
    component: Text,
    ...DefaultConfig,
};

/**
 * Default text component as a paragraph
 */
export const Base = BaseStory;

/**
 * Text containing icons (should match font size)
 */
export const WithIcon = {
    args: {
        ...Base.args,
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
    ...LongTextStory,
    decorators: [withResizableBox()],
};

/**
 * Long text without wrapping
 */
export const NoWrap = {
    ...LongText,
    args: {
        ...LongText.args,
        ...NoWrapStory.args,
    },
};

/**
 * Long text with line breaks
 */
export const AllWhiteSpace = {
    ...AllWhiteSpaceStory,
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
        ...TruncateStory.args,
        ...LongText.args,
    },
};
/**
 * Test the update of the `title` attribute when text overflows
 */
export const TestUpdateTruncateTitleLabel = {
    render(args: any) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [content, setContent] = React.useState<string>('Some text');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const lengthen = React.useCallback(() => setContent((prevContent) => `${prevContent} ${prevContent}`), []);
        return (
            <>
                <Button onClick={lengthen}>Lengthen text</Button>
                <Text as="p" truncate style={{ maxWidth: 300 }} {...args}>
                    {content}
                </Text>
            </>
        );
    },
    // Disables Chromatic snapshot (not relevant for this story).
    parameters: { chromatic: { disable: true } },
};

/**
 * Long text with multi line truncate ellipsis
 */
export const TruncateMultiline = {
    ...LongText,
    args: {
        ...LongText.args,
        ...TruncateMultilineStory.args,
    },
};

/**
 * All typographies
 */
export const AllTypography = {
    ...WithIcon,
    ...AllTypographyStory,
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
    ...AllColorsStory,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'color', options: withUndefined(ColorPalette) },
                cols: { key: 'colorVariant', options: withUndefined(ColorVariant) },
            },
        }),
    ],
};
