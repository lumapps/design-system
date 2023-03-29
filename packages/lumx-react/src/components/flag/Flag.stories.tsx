import { mdiHeart } from '@lumx/icons';
import { ColorPalette, Flag } from '@lumx/react';
import { colorArgType } from '@lumx/react/stories/controls/color';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

export default {
    title: 'LumX components/flag/Flag',
    component: Flag,
    argTypes: { color: colorArgType, icon: iconArgType },
    args: { ...Flag.defaultProps, label: 'Label' },
};

/**
 * Default flag with label
 */
export const Default = {};

/**
 * With icon
 */
export const WithIcon = { args: { icon: mdiHeart } };

/**
 * All `color` variants
 */
export const AllColors = {
    ...WithIcon,
    argTypes: { color: { control: false } },
    decorators: [
        withCombinations({
            combinations: {
                cols: { key: 'color', options: withUndefined(ColorPalette) },
            },
        }),
    ],
};
