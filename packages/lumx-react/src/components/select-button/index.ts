import { ComboboxOption } from '../combobox/ComboboxOption';
import { SelectButton as _SelectButton } from './SelectButton';

export type { SelectTextFieldStatus, SelectButtonTranslations } from '@lumx/core/js/utils/select/types';
export type { SelectButtonProps } from './SelectButton';

/**
 * SelectButton compound component.
 */
export const SelectButton = Object.assign(_SelectButton, {
    /** Selectable option within the dropdown list. */
    Option: ComboboxOption,
});
