import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';

import {
    Default as DefaultConfig,
    NoConfig as NoConfigStory,
    Horizontal as HorizontalStory,
    Vertical as VerticalStory,
    GapSizes as GapSizesStory,
    Wrap as WrapStory,
    NoShrink as NoShrinkStory,
} from '@lumx/core/js/components/FlexBox/Stories';

import { FlexBox } from '.';
import FlexBoxNoConfigVue from './Stories/FlexBoxNoConfig.vue';
import FlexBoxNoShrinkVue from './Stories/FlexBoxNoShrink.vue';
import FlexBoxMarginAutoVue from './Stories/FlexBoxMarginAuto.vue';
import { Alignment, Orientation } from '@lumx/core/js/constants';
import { HORIZONTAL_ALIGNMENTS, VERTICAL_ALIGNMENTS, GAP_SIZES } from '@lumx/core/js/components/FlexBox/constants';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mergeArraysCombinator } from '@lumx/core/stories/utils/combinations';

export default {
    title: 'LumX components/flex-box/FlexBox',
    component: FlexBox,
    ...DefaultConfig,
};

/**
 * Without config, FlexBox acts as a simple <div>
 */
export const NoConfig = {
    ...NoConfigStory,
    render: withRender({ FlexBoxNoConfigVue }),
    decorators: [withWrapper({ style: { border: '1px dashed red' } })],
};

/**
 * Horizontal orientation with all possible item alignments
 */
export const Horizontal = {
    ...NoConfig,
    ...HorizontalStory,
    args: {
        ...NoConfig.args,
        ...HorizontalStory.args,
    },
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'vAlign', options: withUndefined(HORIZONTAL_ALIGNMENTS) },
            },
            cellStyle: { border: '1px dashed red' },
            firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
        }),
    ],
};

/**
 * Vertical orientation with all possible item alignments
 */
export const Vertical = {
    ...NoConfig,
    ...VerticalStory,
    args: {
        ...NoConfig.args,
        ...VerticalStory.args,
    },
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'hAlign', options: withUndefined(VERTICAL_ALIGNMENTS) },
            },
            cellStyle: { border: '1px dashed red', height: '200px' },
            firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
        }),
    ],
};

/**
 * All gap sizes
 */
export const GapSizes = {
    ...NoConfig,
    ...GapSizesStory,
    args: {
        ...NoConfig.args,
        ...GapSizesStory.args,
    },
    decorators: [
        withWrapper({ style: { border: '1px dashed red' } }),
        withCombinations({
            combinations: {
                rows: { key: 'gap', options: withUndefined(GAP_SIZES) },
            },
        }),
    ],
};

/**
 * Wrap items in new row or column
 */
export const Wrap = {
    ...NoConfig,
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

/**
 * Prevent FlexBox from shrinking into a parent flex box
 */
export const NoShrink = {
    ...NoShrinkStory,
    render: withRender({ FlexBoxNoShrinkVue }),
    decorators: [
        withWrapper({
            style: { display: 'flex', border: '1px dashed red', width: '100px', height: '100px', margin: '20px auto' },
        }),
    ],
};

/**
 * All combinations of margin auto values
 */
export const MarginAuto = {
    render: withRender({ FlexBoxMarginAutoVue }),
    decorators: [
        withWrapper({
            style: { display: 'flex', border: '1px dashed red', width: '100px', height: '100px', margin: '20px auto' },
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
            combinator: mergeArraysCombinator,
        }),
    ],
};
