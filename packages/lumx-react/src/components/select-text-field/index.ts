import { ComboboxOption } from '../combobox/ComboboxOption';
import { ComboboxSection } from '../combobox/ComboboxSection';
import { ComboboxOptionMoreInfo } from '../combobox/ComboboxOptionMoreInfo';
import { ComboboxOptionSkeleton } from '../combobox/ComboboxOptionSkeleton';
import { ListDivider } from '../list/ListDivider';
import { SelectTextField as _SelectTextField } from './SelectTextField';

export {
    type SelectTextFieldProps,
    type SingleSelectTextFieldProps,
    type MultipleSelectTextFieldProps,
} from './SelectTextField';
export type { SelectTextFieldStatus, SelectTextFieldTranslations } from '@lumx/core/js/utils/select/types';

/**
 * SelectTextField compound component.
 */
export const SelectTextField = Object.assign(_SelectTextField, {
    /** Selectable option within the dropdown list. */
    Option: ComboboxOption,
    /** Labelled group of options. */
    Section: ComboboxSection,
    /** Info icon on an option that reveals a popover with additional details. */
    OptionMoreInfo: ComboboxOptionMoreInfo,
    /** Skeleton loading placeholder for options being fetched. */
    OptionSkeleton: ComboboxOptionSkeleton,
    /** Visual separator between option groups (alias for ListDivider). Purely decorative — invisible to screen readers. */
    Divider: ListDivider,
});
