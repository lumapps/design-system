import { mdiEmail } from '@lumx/icons';
import { Size } from '@lumx/core/js/constants';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';

export const Default = {
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
