import ComboboxButton from './ComboboxButton';
import ComboboxInput from './ComboboxInput';
import ComboboxList from './ComboboxList';
import ComboboxOption from './ComboboxOption';
import ComboboxOptionAction from './ComboboxOptionAction';
import ComboboxOptionMoreInfo from './ComboboxOptionMoreInfo';
import ComboboxOptionSkeleton from './ComboboxOptionSkeleton';
import ComboboxPopover from './ComboboxPopover';
import ComboboxProvider from './ComboboxProvider';
import ComboboxSection from './ComboboxSection';
import ComboboxState from './ComboboxState';
import { ListDivider } from '../list';

export type { ComboboxProviderProps } from './ComboboxProvider';
export type { ComboboxListProps } from './ComboboxList';
export type { ComboboxPopoverProps } from './ComboboxPopover';
export type { ComboboxButtonProps } from './ComboboxButton';
export type { ComboboxInputProps } from './ComboboxInput';
export type { ComboboxOptionProps } from './ComboboxOption';
export type { ComboboxOptionActionProps } from './ComboboxOptionAction';
export type { ComboboxOptionMoreInfoProps } from './ComboboxOptionMoreInfo';
export type { ComboboxOptionSkeletonProps } from './ComboboxOptionSkeleton';
export type { ComboboxSectionProps } from './ComboboxSection';
export type { ComboboxStateProps } from './ComboboxState';

export type { ComboboxButtonLabelDisplayMode } from '@lumx/core/js/components/Combobox/ComboboxButton';
export type { ComboboxListType } from '@lumx/core/js/components/Combobox/ComboboxList';
export type { ComboboxHandle, ComboboxCallbacks } from '@lumx/core/js/components/Combobox/types';

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
    /** Listbox container that registers with the combobox handle and tracks loading state. */
    List: ComboboxList,
    /** Selectable option item with filtering and keyboard navigation support. */
    Option: ComboboxOption,
    /** Secondary action button within a grid-mode option row, rendered as an independent gridcell. */
    OptionAction: ComboboxOptionAction,
    /** Info button on an option that shows a popover on hover or keyboard highlight. */
    OptionMoreInfo: ComboboxOptionMoreInfo,
    /** Loading placeholder skeleton(s) that auto-register loading state with the combobox handle. */
    OptionSkeleton: ComboboxOptionSkeleton,
    /** Floating popover container that auto-binds to the combobox anchor and open/close state. */
    Popover: ComboboxPopover,
    /** Labelled group of options that auto-hides when all its child options are filtered out. */
    Section: ComboboxSection,
    /** Displays empty, error, and loading state messages for the combobox list. */
    State: ComboboxState,
    /** Visual separator between option groups (alias for ListDivider). Purely decorative — invisible to screen readers. */
    Divider: ListDivider,
};
