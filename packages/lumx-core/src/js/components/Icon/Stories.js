import { mdiEmail } from '@lumx/icons';

import { Size } from '@lumx/core/js/constants';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType, colorVariantArgType } from '@lumx/react/stories/controls/color';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { Icon } from '.';

const iconSizes = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export default {
    argTypes: {
        icon: iconArgType,
        hasShape: { control: 'boolean' },
        color: colorArgType,
        colorVariant: colorVariantArgType,
    },
    args: Icon.defaultProps,
};

export const SizeAndShape = {
    args: {
        icon: mdiEmail,
    },
    argTypes: {
        hasShape: { control: false },
        size: { control: false },
    },
    getDecorators: ({ withCombinations }) => [
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
