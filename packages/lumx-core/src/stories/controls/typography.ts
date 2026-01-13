import { TypographyCustom, TypographyInterface } from '../../js/constants';

import { getSelectArgType } from './selectArgType';

export const ALL_TYPOGRAPHY = [...Object.values(TypographyInterface), ...Object.values(TypographyCustom)];
export const allTypographyArgType = getSelectArgType(ALL_TYPOGRAPHY);
