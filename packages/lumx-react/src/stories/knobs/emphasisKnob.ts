import { Emphasis } from '@lumx/react';
import { select } from '@storybook/addon-knobs';

export const emphasis = (
    name = 'Emphasis',
    value: Emphasis = Emphasis.high,
    groupId: string | undefined = undefined,
): Emphasis => select(name, Emphasis, value, groupId);
