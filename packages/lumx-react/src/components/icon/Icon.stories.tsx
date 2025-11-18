import DefaultStory, { SizeAndShape as DefaultSizeAndShape } from '@lumx/core/js/components/Icon/Stories';
import { mdiEmail } from '@lumx/icons';
import { ColorPalette, ColorVariant, GridColumn, Icon, Size } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

export default {
    title: 'LumX components/icon/Icon',
    component: Icon,
    ...DefaultStory,
};

/**
 * All combinations of size and shape
 */
export const SizeAndShape = {
    ...DefaultSizeAndShape,
};

/**
 * All combinations of size and shape
 */
export const AllColors = {
    args: {
        size: Size.m,
        icon: mdiEmail,
    },
    argTypes: {
        hasShape: { control: false },
        color: { control: false },
        colorVariant: { control: false },
    },
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
