import { ListboxOption } from '../listbox/ListboxOption';
import { ListboxSection } from '../listbox/ListboxSection';
import { ListboxOptionMoreInfo } from '../listbox/ListboxOptionMoreInfo';
import { ListDivider } from '../list/ListDivider';
import { SelectList as _SelectList } from './SelectList';

export { type SelectListProps, type SingleSelectListProps, type MultipleSelectListProps } from './SelectList';
export type { SelectListStatus, SelectListTranslations } from '@lumx/core/js/utils/select/types';
export type { SelectListWidth } from '@lumx/core/js/components/SelectList';

/**
 * SelectList compound component.
 */
export const SelectList = Object.assign(_SelectList, {
    /** Selectable option within the list (use it in `renderOption`). */
    Option: ListboxOption,
    /** Labelled group of options. */
    Section: ListboxSection,
    /** Info icon on an option that reveals a popover with additional details. */
    OptionMoreInfo: ListboxOptionMoreInfo,
    /** Visual separator between option groups (alias for ListDivider). Purely decorative — invisible to screen readers. */
    Divider: ListDivider,
});
