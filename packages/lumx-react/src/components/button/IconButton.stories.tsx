import { mdiSend } from '@lumx/icons';
import { ButtonSize, Emphasis, IconButton, Size } from '@lumx/react';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { colorArgType } from '@lumx/react/stories/controls/color';
import { SQUARE_IMAGES, squareImageArgType } from '@lumx/react/stories/controls/image';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { StateVariations } from './Button.stories';

export default {
    title: 'LumX components/button/IconButton',
    component: IconButton,
    argTypes: {
        isSelected: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
        hasBackground: { control: 'boolean' },
        emphasis: getSelectArgType(Emphasis),
        size: getSelectArgType<ButtonSize>([Size.s, Size.m]),
        icon: iconArgType,
        color: colorArgType,
    },
    args: IconButton.defaultProps,
};

/**
 * Default IconButton
 */
export const Default = {
    args: { icon: mdiSend },
};

/**
 * IconButton using an image
 */
export const WithImage = {
    argTypes: squareImageArgType,
    args: { image: SQUARE_IMAGES.square1 },
};

/**
 * IconButton using a tooltip
 */
export const WithTooltip = {
    args: { icon: mdiSend, label: 'Send a message' },
};

/**
 * Check icon button style variations (color, states, emphasis, etc.)
 */
export const IconStateVariations = {
    ...Default,
    decorators: StateVariations.decorators,
};
