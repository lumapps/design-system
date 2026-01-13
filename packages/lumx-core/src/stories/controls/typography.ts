import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { TypographyCustom, TypographyInterface } from '@lumx/react';

export const ALL_TYPOGRAPHY = [...Object.values(TypographyInterface), ...Object.values(TypographyCustom)];
export const allTypographyArgType = getSelectArgType(ALL_TYPOGRAPHY);
