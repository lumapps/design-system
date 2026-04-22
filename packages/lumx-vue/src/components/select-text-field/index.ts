import _ComboboxOption from '../combobox/ComboboxOption';
import _ComboboxSection from '../combobox/ComboboxSection';
import _ComboboxOptionMoreInfo from '../combobox/ComboboxOptionMoreInfo';
import _ComboboxOptionSkeleton from '../combobox/ComboboxOptionSkeleton';
import _ListDivider from '../list/ListDivider';

export {
    type SelectTextFieldProps,
    type SingleSelectTextFieldProps,
    type MultipleSelectTextFieldProps,
    default as SelectTextField,
} from './SelectTextField';
export type { SelectTextFieldStatus, SelectTextFieldTranslations } from '@lumx/core/js/utils/select/types';

/** Selectable option within the dropdown list. */
export const SelectTextFieldOption = _ComboboxOption;

/** Labelled group of options. */
export const SelectTextFieldSection = _ComboboxSection;

/** Info icon on an option that reveals a popover with additional details. */
export const SelectTextFieldOptionMoreInfo = _ComboboxOptionMoreInfo;

/** Skeleton loading placeholder for options being fetched. */
export const SelectTextFieldOptionSkeleton = _ComboboxOptionSkeleton;

/** Visual separator between option groups (alias for ListDivider). Purely decorative — invisible to screen readers. */
export const SelectTextFieldDivider = _ListDivider;
