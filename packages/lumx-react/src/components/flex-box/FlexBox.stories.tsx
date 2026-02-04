import { Alignment, Button, IconButton, Orientation, Text } from '@lumx/react';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mdiAtom } from '@lumx/icons';
import mergeWith from 'lodash/fp/mergeWith';
import castArray from 'lodash/castArray';

import {
    Default as DefaultConfig,
    NoConfig as NoConfigStory,
    Horizontal as HorizontalStory,
    Vertical as VerticalStory,
    GapSizes as GapSizesStory,
    Wrap as WrapStory,
    NoShrink as NoShrinkStory,
} from '@lumx/core/js/components/FlexBox/Stories';
import { GAP_SIZES, HORIZONTAL_ALIGNMENTS, VERTICAL_ALIGNMENTS } from '@lumx/core/js/components/FlexBox/constants';

import { FlexBox } from './FlexBox';

export default {
    title: 'LumX components/flex-box/FlexBox',
    component: FlexBox,
    args: FlexBox.defaultProps,
    ...DefaultConfig,
};

/** Without config, FlexBox acts as a simple <div> */
export const NoConfig = {
    ...NoConfigStory,
    args: {
        ...NoConfigStory.args,
        children: [
            <Button key="1">Button 1</Button>,
            <Text key="2" as="p">
                Some paragraph
            </Text>,
            <Button key="3">Button 3</Button>,
        ],
    },
    decorators: [withWrapper({ style: { border: '1px dashed red' } })],
};

/** Horizontal orientation with all possible item alignments */
export const Horizontal = {
    ...NoConfig,
    ...HorizontalStory,
    args: {
        ...NoConfig.args,
        ...HorizontalStory.args,
    },
    decorators: [
        withCombinations({
            cellStyle: { border: '1px dashed red' },
            firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
            combinations: { rows: { key: 'vAlign', options: withUndefined(HORIZONTAL_ALIGNMENTS) } },
        }),
    ],
};

/** Vertical orientation with all possible item alignments */
export const Vertical = {
    ...NoConfig,
    ...VerticalStory,
    args: {
        ...NoConfig.args,
        ...VerticalStory.args,
    },
    decorators: [
        withCombinations({
            cellStyle: { border: '1px dashed red', height: '200px' },
            firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
            combinations: { rows: { key: 'hAlign', options: withUndefined(VERTICAL_ALIGNMENTS) } },
        }),
    ],
};

/** All gap sizes */
export const GapSizes = {
    ...Horizontal,
    ...GapSizesStory,
    args: {
        ...Horizontal.args,
        ...GapSizesStory.args,
    },
    decorators: [
        ...NoConfig.decorators,
        withCombinations({
            combinations: {
                rows: { key: 'gap', options: withUndefined(GAP_SIZES) },
            },
        }),
    ],
};

/** Wrap items in new row or column */
export const Wrap = {
    ...WrapStory,
    args: {
        ...NoConfig.args,
        ...WrapStory.args,
    },
    decorators: [
        withWrapper({ style: { border: '1px dashed red', width: '100px', height: '100px', margin: '20px auto' } }),
        withCombinations({
            cellStyle: { width: '50%' },
            combinations: {
                cols: { key: 'orientation', options: Object.values(Orientation) },
                rows: { 'No wrap': { wrap: false }, Wrap: { wrap: true } },
            },
        }),
    ],
};

/** Prevent FlexBox from shrinking into a parent flex box */
export const NoShrink = {
    ...NoShrinkStory,
    args: {
        ...NoShrinkStory.args,
        children: <Text as="p">Some paragraph</Text>,
    },
    decorators: [
        withWrapper({
            style: { display: 'flex', border: '1px dashed red', width: 100, height: 100, margin: '20px auto' },
        }),
    ],
};

/** All combinations of margin auto values */
export const MarginAuto = {
    args: { children: <IconButton label="" icon={mdiAtom} /> },
    decorators: [
        withWrapper({
            style: { display: 'flex', border: '1px dashed red', width: 100, height: 100, margin: '20px auto' },
        }),
        withCombinations({
            combinations: {
                rows: {
                    key: 'marginAuto',
                    options: [undefined, Alignment.left, Alignment.top, [Alignment.left, Alignment.top]],
                },
                cols: {
                    key: 'marginAuto',
                    options: [undefined, Alignment.right, Alignment.bottom, [Alignment.right, Alignment.bottom]],
                },
            },
            combinator: mergeWith((a, b) => {
                if (a && b) {
                    return [...castArray(a), ...castArray(b)].filter(Boolean);
                }
                return undefined;
            }),
        }),
    ],
};
