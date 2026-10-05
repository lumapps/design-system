import { ListboxOption } from '../listbox/ListboxOption';
import { ListboxSection } from '../listbox/ListboxSection';
import { ListboxOptionMoreInfo } from '../listbox/ListboxOptionMoreInfo';
import { ListboxOptionSkeleton } from '../listbox/ListboxOptionSkeleton';
import { ListDivider } from '../list/ListDivider';
import { SelectTextField as _SelectTextField } from './SelectTextField';

export {
    type SelectTextFieldProps,
    type SingleSelectTextFieldProps,
    type MultipleSelectTextFieldProps,
} from './SelectTextField';
export type { SelectListStatus, SelectListStatus as SelectTextFieldStatus } from '@lumx/core/js/utils/select/types';
export type { SelectTextFieldTranslations } from '@lumx/core/js/utils/select/types';

/**
 * SelectTextField compound component.
 */
export const SelectTextField = Object.assign(_SelectTextField, {
    /** Selectable option within the dropdown list. */
    Option: ListboxOption,
    /** Labelled group of options. */
    Section: ListboxSection,
    /** Info icon on an option that reveals a popover with additional details. */
    OptionMoreInfo: ListboxOptionMoreInfo,
    /** Skeleton loading placeholder for options being fetched. */
    OptionSkeleton: ListboxOptionSkeleton,
    /** Visual separator between option groups (alias for ListDivider). Purely decorative — invisible to screen readers. */
    Divider: ListDivider,
});
