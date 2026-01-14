import { ColorPalette, ColorVariant, GridColumn, Icon, IconSizes, Size } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import {
    AllColors as AllColorsStory,
    Default,
    SizeAndShape as SizeAndShapeStory,
} from '@lumx/core/js/components/Icon/Stories';

const iconSizes: Array<IconSizes> = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export default {
    component: Icon,
    args: Icon.defaultProps,
    title: 'LumX components/icon/Icon',
    ...Default,
};

/**
 * All combinations of size and shape
 */
export const SizeAndShape = {
    ...SizeAndShapeStory,
    decorators: [
        withCombinations({
            combinations: {
                cols: { key: 'size', options: withUndefined(iconSizes) },
                rows: {
                    Default: {},
                    'Has shape': { hasShape: true },
                },
            },
        }),
    ],
};

/**
 * All combinations of size and shape
 */
export const AllColors = {
    ...AllColorsStory,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'color', options: withUndefined(ColorPalette) },
                cols: { key: 'colorVariant', options: withUndefined(ColorVariant) },
                sections: {
                    Default: {},
                    'Has shape': { hasShape: true },
                },
            },
        }),
        withWrapper({ maxColumns: 2, itemMinWidth: 500 }, GridColumn),
    ],
};
