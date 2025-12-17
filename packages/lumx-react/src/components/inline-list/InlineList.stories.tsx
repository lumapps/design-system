import { mdiEarth } from '@lumx/icons';
import { Icon, Text } from '@lumx/react';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { allTypographyArgType } from '@lumx/react/stories/controls/typography';
import { colorArgType, colorVariantArgType } from '@lumx/react/stories/controls/color';
import { InlineList } from '.';

export default {
    title: 'LumX components/inline-list/InlineList',
    component: InlineList,
    argTypes: {
        typography: allTypographyArgType,
        color: colorArgType,
        colorVariant: colorVariantArgType,
        children: { control: false },
    },
};

/**
 * Inline list with three simple text elements
 */
export const WithElements = {
    args: {
        children: [
            <span key="1">Some text</span>,
            <span key="2">Some other text</span>,
            <span key="3">Some other other text</span>,
        ],
    },
};

/**
 * Using color, typography and more complex elements
 */
export const MixedNoWrapAndTruncate = {
    args: {
        typography: 'body1',
        color: 'dark',
        colorVariant: 'L2',
        style: { width: '100%' },
        children: [
            <Text key="1" as="span" truncate>
                Very very very very very long text
            </Text>,
            <Text key="2" as="span" noWrap>
                <Icon icon={mdiEarth} />
                Some text
            </Text>,
            <Text key="3" as="span" truncate>
                Very very very very very long text
            </Text>,
        ],
    },
    decorators: [withResizableBox({ width: 400 })],
};

/**
 * Line wrap on overflow
 */
export const Wrap = {
    args: {
        wrap: true,
        children: [
            <Text key="1" as="span">
                Very very very very very long text
            </Text>,
            <Text key="2" as="span">
                <Icon icon={mdiEarth} />
                Some text
            </Text>,
            <Text key="3" as="span">
                Very very very very very long text
            </Text>,
        ],
    },
    decorators: [withResizableBox({ width: 400 })],
};
