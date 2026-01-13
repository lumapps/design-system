import { mdiEmail } from '@lumx/icons';
import { ColorPalette, ColorVariant, GridColumn, Icon, IconSizes, Size } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

const iconSizes: Array<IconSizes> = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export default {
    title: 'LumX components/icon/Icon',
    component: Icon,
    args: Icon.defaultProps,
    argTypes: {
        icon: iconArgType,
        hasShape: { control: 'boolean' },
        color: colorArgType,
        colorVariant: colorVariantArgType,
    },
};

/**
 * All combinations of size and shape
 */
export const SizeAndShape = {
    args: {
        icon: mdiEmail,
    },
    argTypes: {
        hasShape: { control: false },
        size: { control: false },
    },
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
