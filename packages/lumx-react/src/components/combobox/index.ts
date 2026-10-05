import { ListDivider } from '../list/ListDivider';
import { ListboxList } from '../listbox/ListboxList';
import { ListboxOption } from '../listbox/ListboxOption';
import { ListboxOptionAction } from '../listbox/ListboxOptionAction';
import { ListboxOptionMoreInfo } from '../listbox/ListboxOptionMoreInfo';
import { ListboxOptionSkeleton } from '../listbox/ListboxOptionSkeleton';
import { ListboxOptionSelectionIcon } from '../listbox/ListboxOptionSelectionIcon';
import { ListboxSection } from '../listbox/ListboxSection';
import { ListboxState } from '../listbox/ListboxState';
import { ComboboxButton } from './ComboboxButton';
import { ComboboxInput } from './ComboboxInput';
import { ComboboxPopover } from './ComboboxPopover';
import { ComboboxProvider } from './ComboboxProvider';
import { useComboboxEvent } from './context/useComboboxEvent';

export type { ComboboxProviderProps } from './ComboboxProvider';
export type { ComboboxPopoverProps, ComboboxPopoverComponentProps } from './ComboboxPopover';
export type { ComboboxButtonProps } from './ComboboxButton';
export type { ComboboxInputProps } from './ComboboxInput';
// The list, option, section and state modules are the listbox ones (public names unchanged).
export type { ListboxListProps as ComboboxListProps } from '../listbox/ListboxList';
export type { ListboxOptionProps as ComboboxOptionProps } from '../listbox/ListboxOption';
export type { ListboxOptionActionProps as ComboboxOptionActionProps } from '../listbox/ListboxOptionAction';
export type { ListboxOptionMoreInfoProps as ComboboxOptionMoreInfoProps } from '../listbox/ListboxOptionMoreInfo';
export type { ListboxOptionSkeletonProps as ComboboxOptionSkeletonProps } from '../listbox/ListboxOptionSkeleton';
export type { ListboxSectionProps as ComboboxSectionProps } from '../listbox/ListboxSection';
export type { ListboxStateProps as ComboboxStateProps } from '../listbox/ListboxState';

/**
 * Combobox compound component namespace.
 */
export const Combobox = {
    /** Provides shared combobox context (handle, listbox ID, anchor ref) to all sub-components. */
    Provider: ComboboxProvider,
    /** Button trigger for select-only combobox mode with keyboard navigation and typeahead. */
    Button: ComboboxButton,
    /** Text input trigger for autocomplete combobox mode with optional toggle button and filtering. */
    Input: ComboboxInput,
    /** Listbox container linked to the combobox trigger (must be rendered inside `Combobox.Provider`). */
    List: ListboxList,
    /** Selectable option item with filtering and keyboard navigation support. */
    Option: ListboxOption,
    /** Secondary action button within a grid-mode option row, rendered as an independent gridcell. */
    OptionAction: ListboxOptionAction,
    /** Info button on an option that shows a popover on hover or keyboard highlight. */
    OptionMoreInfo: ListboxOptionMoreInfo,
    /** Loading placeholder skeleton(s) that auto-register loading state with the combobox handle. */
    OptionSkeleton: ListboxOptionSkeleton,
    /** Selection state icon (check circle / radio, or checkbox in multiple lists) for the `after` slot of an option. Reads the option `isSelected` and the list `aria-multiselectable`. */
    SelectionIcon: ListboxOptionSelectionIcon,
    /** Floating popover container that auto-binds to the combobox anchor and open/close state. */
    Popover: ComboboxPopover,
    /** Labelled group of options that auto-hides when all its child options are filtered out. */
    Section: ListboxSection,
    /** Displays empty, error, and loading state messages for the combobox list. */
    State: ListboxState,
    /** Visual separator between option groups (alias for ListDivider). Purely decorative — invisible to screen readers. */
    Divider: ListDivider,
    /** Hook to subscribe to combobox events. Must be used within a Combobox.Provider. */
    useComboboxEvent,
};
