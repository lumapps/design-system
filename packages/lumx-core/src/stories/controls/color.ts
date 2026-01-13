import { ColorPalette, ColorVariant } from '@lumx/react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';

export const ALL_COLORS = Object.values(ColorPalette);
export const colorArgType = getSelectArgType(withUndefined(ALL_COLORS));
export const colorVariantArgType = getSelectArgType(ColorVariant);
