import { ColorPalette, ColorVariant } from '../../js/constants';

import { getSelectArgType } from './selectArgType';
import { withUndefined } from './withUndefined';

export const ALL_COLORS = Object.values(ColorPalette);
export const colorArgType = getSelectArgType(withUndefined(ALL_COLORS));
export const colorVariantArgType = getSelectArgType(ColorVariant);
