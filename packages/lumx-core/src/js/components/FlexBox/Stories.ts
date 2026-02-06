import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mergeArraysCombinator } from '@lumx/core/stories/utils/combinations';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { Alignment, Orientation } from '../../constants';
import { GAP_SIZES, HORIZONTAL_ALIGNMENTS, VERTICAL_ALIGNMENTS } from './constants';

/**
 * Setup FlexBox stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    args,
    decorators: { withWrapper, withCombinations },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'NoShrink' | 'MarginAuto';
    decorators: 'withCombinations' | 'withWrapper';
}>) {
    return {
        meta: {
            component,
            render,
            args: {
                style: { width: '100%', height: '100%' },
                ...args,
            },
            argTypes: {
                orientation: getSelectArgType(Orientation),
                fillSpace: { control: 'boolean' },
                wrap: { control: 'boolean' },
                noShrink: { control: 'boolean' },
                hAlign: getSelectArgType(VERTICAL_ALIGNMENTS),
                vAlign: getSelectArgType(HORIZONTAL_ALIGNMENTS),
                gap: getSelectArgType(GAP_SIZES),
            },
        },

        /** Without config, FlexBox acts as a simple <div> */
        NoConfig: {
            decorators: [withWrapper({ style: { border: '1px dashed red' } })],
        },

        /** Horizontal orientation with all possible item alignments */
        Horizontal: {
            args: { orientation: Orientation.horizontal },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'vAlign', options: withUndefined(HORIZONTAL_ALIGNMENTS) },
                    },
                    cellStyle: { border: '1px dashed red' },
                    firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
                }),
            ],
        },

        /** Vertical orientation with all possible item alignments */
        Vertical: {
            args: { orientation: Orientation.vertical },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'hAlign', options: withUndefined(VERTICAL_ALIGNMENTS) },
                    },
                    cellStyle: { border: '1px dashed red', height: '200px' },
                    firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
                }),
            ],
        },

        /** All gap sizes */
        GapSizes: {
            args: { orientation: Orientation.horizontal },
            argTypes: { gap: { control: false } },
            decorators: [
                withWrapper({ style: { border: '1px dashed red' } }),
                withCombinations({
                    combinations: {
                        rows: { key: 'gap', options: withUndefined(GAP_SIZES) },
                    },
                }),
            ],
        },

        /** Wrap items in new row or column */
        Wrap: {
            args: { orientation: Orientation.horizontal, wrap: true },
            argTypes: { wrap: { control: false } },
            decorators: [
                withWrapper({
                    style: { border: '1px dashed red', width: '100px', height: '100px', margin: '20px auto' },
                }),
                withCombinations({
                    cellStyle: { width: '50%' },
                    combinations: {
                        cols: { key: 'orientation', options: Object.values(Orientation) },
                        rows: { 'No wrap': { wrap: false }, Wrap: { wrap: true } },
                    },
                }),
            ],
        },

        /** Prevent FlexBox from shrinking into a parent flex box */
        NoShrink: {
            args: { noShrink: true, ...overrides.NoShrink?.args },
            decorators: [
                withWrapper({
                    style: {
                        display: 'flex',
                        border: '1px dashed red',
                        width: '100px',
                        height: '100px',
                        margin: '20px auto',
                    },
                }),
            ],
            ...overrides.NoShrink,
        },

        /** All combinations of margin auto values */
        MarginAuto: {
            decorators: [
                withWrapper({
                    style: {
                        display: 'flex',
                        border: '1px dashed red',
                        width: '100px',
                        height: '100px',
                        margin: '20px auto',
                    },
                }),
                withCombinations({
                    combinations: {
                        rows: {
                            key: 'marginAuto',
                            options: [undefined, Alignment.left, Alignment.top, [Alignment.left, Alignment.top]],
                        },
                        cols: {
                            key: 'marginAuto',
                            options: [
                                undefined,
                                Alignment.right,
                                Alignment.bottom,
                                [Alignment.right, Alignment.bottom],
                            ],
                        },
                    },
                    combinator: mergeArraysCombinator,
                }),
            ],
            ...overrides.MarginAuto,
            args: {
                // Reset styles
                style: undefined,
                ...overrides.MarginAuto?.args,
            },
        },
    };
}
