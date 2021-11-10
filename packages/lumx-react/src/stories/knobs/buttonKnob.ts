import { Button, ButtonProps, Size } from '@lumx/react';
import { select } from '@storybook/addon-knobs';
import { ButtonSize } from '@lumx/react/components/button/ButtonRoot';

export const buttonSize = (
    name = 'Size',
    value: ButtonSize = Button.defaultProps?.size as any,
    groupId: string | undefined = undefined,
): ButtonProps['size'] => select(name, [Size.m, Size.s], value, groupId);
