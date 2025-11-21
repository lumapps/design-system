import { Alignment, Button, IconButton, Orientation, Size, Text } from '@lumx/react';

import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { mdiAtom } from '@lumx/icons';
import mergeWith from 'lodash/fp/mergeWith';
import castArray from 'lodash/castArray';
import { FlexBox } from './FlexBox';

const gapSizes = [Size.tiny, Size.regular, Size.medium, Size.big, Size.huge];
const spaceAlignments = [Alignment.spaceBetween, Alignment.spaceEvenly, Alignment.spaceAround];
const verticalAlignments = [...spaceAlignments, Alignment.top, Alignment.center, Alignment.bottom];
const horizontalAlignments = [...spaceAlignments, Alignment.left, Alignment.center, Alignment.right];

export default {
    title: 'LumX components/flex-box/FlexBox',
    component: FlexBox,
    args: FlexBox.defaultProps,
    argTypes: {
        orientation: getSelectArgType(Orientation),
        fillSpace: { control: 'boolean' },
        wrap: { control: 'boolean' },
        noShrink: { control: 'boolean' },
        hAlign: getSelectArgType(verticalAlignments),
        vAlign: getSelectArgType(horizontalAlignments),
        gap: getSelectArgType(gapSizes),
    },
};

/** Without config, FlexBox acts as a simple <div> */
export const NoConfig = {
    args: {
        style: { width: '100%', height: '100%' },
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
    args: {
        ...NoConfig.args,
        orientation: Orientation.horizontal,
    },
    decorators: [
        withCombinations({
            cellStyle: { border: '1px dashed red' },
            firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
            combinations: { rows: { key: 'vAlign', options: withUndefined(horizontalAlignments) } },
        }),
    ],
};

/** Vertical orientation with all possible item alignments */
export const Vertical = {
    ...NoConfig,
    args: {
        ...NoConfig.args,
        orientation: Orientation.vertical,
    },
    decorators: [
        withCombinations({
            cellStyle: { border: '1px dashed red', height: '200px' },
            firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
            combinations: { rows: { key: 'hAlign', options: withUndefined(verticalAlignments) } },
        }),
    ],
};

/** All gap sizes */
export const GapSizes = {
    ...Horizontal,
    argTypes: {
        gap: { control: false },
    },
    decorators: [
        ...NoConfig.decorators,
        withCombinations({
            combinations: {
                rows: { key: 'gap', options: withUndefined(gapSizes) },
            },
        }),
    ],
};

/** Wrap items in new row or column */
export const Wrap = {
    args: {
        ...NoConfig.args,
        orientation: Orientation.horizontal,
        wrap: true,
    },
    argTypes: {
        wrap: { control: false },
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
    args: {
        children: <Text as="p">Some paragraph</Text>,
        noShrink: true,
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
