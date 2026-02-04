import { mdiSend } from '@lumx/icons';
import { Emphasis, Size } from '@lumx/core/js/constants';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { SQUARE_IMAGES, squareImageArgType } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';

import { IconButton } from './IconButton';
import { ButtonSize } from './ButtonRoot';

export const Default = {
    argTypes: {
        isSelected: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
        hasBackground: { control: 'boolean' },
        emphasis: getSelectArgType(Emphasis),
        size: getSelectArgType<ButtonSize>([Size.s, Size.m]),
        icon: iconArgType,
        color: colorArgType,
        ref: { table: { disable: true } },
        linkAs: { table: { disable: true } },
        className: { table: { disable: true } },
        target: { if: { arg: 'href', exists: true }, control: { type: 'inline-radio' } },
        type: { if: { arg: 'href', exists: false }, control: { type: 'inline-radio' } },
    },
    args: IconButton.defaultProps,
};

/**
 * Base IconButton
 */
export const Base = {
    args: { icon: mdiSend, label: 'Button label' },
};

/**
 * IconButton using an image
 */
export const WithImage = {
    argTypes: squareImageArgType,
    args: { image: SQUARE_IMAGES.square1 },
};
