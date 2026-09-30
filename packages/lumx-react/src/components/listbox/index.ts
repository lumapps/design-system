/**
 * Listbox modules (internal, not exported from the package): the list, its options, sections,
 * skeletons and state. The combobox composes them (see `Combobox`).
 */
import { ListboxList as List } from './ListboxList';
import { ListboxOption } from './ListboxOption';
import { ListboxOptionAction } from './ListboxOptionAction';
import { ListboxOptionMoreInfo } from './ListboxOptionMoreInfo';
import { ListboxOptionSkeleton } from './ListboxOptionSkeleton';
import { ListboxProvider } from './ListboxProvider';
import { ListboxOptionSelectionIcon } from './ListboxOptionSelectionIcon';
import { ListboxSection } from './ListboxSection';
import { ListboxState } from './ListboxState';

export const Listbox = {
    /** Standalone listbox provider (creates the listbox handle). */
    Provider: ListboxProvider,
    /** List (listbox pattern by default, grid pattern with `type="grid"` for options with actions). */
    List,
    Option: ListboxOption,
    OptionAction: ListboxOptionAction,
    OptionMoreInfo: ListboxOptionMoreInfo,
    OptionSkeleton: ListboxOptionSkeleton,
    SelectionIcon: ListboxOptionSelectionIcon,
    Section: ListboxSection,
    State: ListboxState,
};
