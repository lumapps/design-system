import _ListboxOption from '../listbox/ListboxOption';
import _ListboxSection from '../listbox/ListboxSection';
import _ListboxOptionMoreInfo from '../listbox/ListboxOptionMoreInfo';
import _ListDivider from '../list/ListDivider';

export {
    default as SelectList,
    type SelectListProps,
    type SingleSelectListProps,
    type MultipleSelectListProps,
} from './SelectList';
export type { SelectListStatus, SelectListTranslations } from '@lumx/core/js/utils/select/types';
export type { SelectListWidth } from '@lumx/core/js/components/SelectList';

/** Selectable option within the list (use it in the `option` slot). */
export const SelectListOption = _ListboxOption;

/** Labelled group of options. */
export const SelectListSection = _ListboxSection;

/** Info icon on an option that reveals a popover with additional details. */
export const SelectListOptionMoreInfo = _ListboxOptionMoreInfo;

/** Visual separator between option groups (alias for ListDivider). Purely decorative — invisible to screen readers. */
export const SelectListDivider = _ListDivider;
