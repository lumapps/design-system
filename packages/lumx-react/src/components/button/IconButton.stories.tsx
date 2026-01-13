import { mdiSend } from '@lumx/icons';
import { ButtonSize, Emphasis, IconButton, Size } from '@lumx/react';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { SQUARE_IMAGES, squareImageArgType } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
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
        ref: { table: { disable: true } },
        onClick: { action: true, table: { disable: true } },
        linkAs: { table: { disable: true } },
        className: { table: { disable: true } },
        target: { if: { arg: 'href', exists: true }, control: { type: 'inline-radio' } },
        type: { if: { arg: 'href', exists: false }, control: { type: 'inline-radio' } },
    },
    args: IconButton.defaultProps,
};

/**
 * Default IconButton
 */
export const Default = {
    args: { icon: mdiSend, label: 'Button label' },
};

/**
 * IconButton using an image
 */
export const WithImage = {
    argTypes: squareImageArgType,
    args: { image: SQUARE_IMAGES.square1 },
};

/**
 * Check icon button style variations (color, states, emphasis, etc.)
 */
export const IconStateVariations = {
    ...Default,
    argTypes: { ...Default.args, ...StateVariations.argTypes },
    decorators: StateVariations.decorators,
};
