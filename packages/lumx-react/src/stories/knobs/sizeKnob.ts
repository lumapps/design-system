import { Size } from '@lumx/react';
import { enumKnob } from '@lumx/react/stories/knobs/enumKnob';

export const sizeKnob = (size?: Size) =>
    enumKnob('Size', [undefined, Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl] as const, size as any);