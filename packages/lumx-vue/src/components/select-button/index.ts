import _ComboboxOption from '../combobox/ComboboxOption';

export {
    default as SelectButton,
    type SelectButtonProps,
    type SingleSelectButtonProps,
    type MultipleSelectButtonProps,
    type SelectButtonButtonSlotProps,
} from './SelectButton';
export type {
    SelectListStatus,
    SelectListStatus as SelectButtonStatus,
    SelectButtonTranslations,
} from '@lumx/core/js/utils/select/types';

/** Selectable option within the dropdown list. */
export const SelectButtonOption = _ComboboxOption;
