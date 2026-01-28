import { mdiEmail } from '@lumx/icons';
import { Size } from '@lumx/core/js/constants';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { ICON_SIZES } from './constants';

export const Default = {
    argTypes: {
        icon: iconArgType,
        hasShape: { control: 'boolean' },
        size: getSelectArgType(ICON_SIZES, 'inline-radio'),
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
};

/**
 * Icon inside a text component
 * (renders as inline instead of block and can adapt to the verticalAlign)
 */
export const InsideText = {
    args: {
        icon: mdiEmail,
        size: 'm',
    },
    argTypes: {
        verticalAlign: { control: 'inline-radio', options: [undefined, 'middle'] },
    },
};
