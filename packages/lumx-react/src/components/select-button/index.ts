import { ListboxOption } from '../listbox/ListboxOption';
import { SelectButton as _SelectButton } from './SelectButton';

export type {
    SelectListStatus,
    SelectListStatus as SelectButtonStatus,
    SelectButtonTranslations,
} from '@lumx/core/js/utils/select/types';
export type { SelectButtonProps, SingleSelectButtonProps, MultipleSelectButtonProps } from './SelectButton';

/**
 * SelectButton compound component.
 */
export const SelectButton = Object.assign(_SelectButton, {
    /** Selectable option within the dropdown list. */
    Option: ListboxOption,
});
