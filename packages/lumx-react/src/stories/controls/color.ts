import { ColorPalette, ColorVariant } from '@lumx/react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';

export const ALL_COLORS = Object.values(ColorPalette);
export const colorArgType = getSelectArgType(ALL_COLORS);
export const colorVariantArgType = getSelectArgType(ColorVariant);
