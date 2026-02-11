import { ComboboxButton } from '../ComboboxButton';
import { ComboboxInput } from '../ComboboxInput';
import { ComboboxListBox } from '../ComboboxListBox';
import { ComboboxOption } from '../ComboboxOption';
import { ComboboxOptionSkeleton } from '../ComboboxOption/ComboboxOptionSkeleton';
import { ComboboxSection } from '../ComboboxSection';
import { Combobox as BaseCombobox } from './Combobox';

export const SUB_COMPONENTS = {
    /**
     * Option to set within a combobox list.
     *
     * @family Combobox
     * @param ComboboxOptionProps
     * @returns ComboboxOption
     */
    Option: ComboboxOption,
    /**
     * Skeleton for a combobox option.
     * A typography skeleton is rendered by default but can be overridden by passing children.
     */
    OptionSkeleton: ComboboxOptionSkeleton,
    /**
     * Section for options of a Combobox.
     *
     * @family Combobox
     * @param ComboboxSectionProps
     * @returns ComboboxSection
     */
    Section: ComboboxSection,
    /**
     * Combobox input trigger.
     *
     * @family Combobox
     */
    Input: ComboboxInput,
    /**
     * The listbox containing the combobox's options.
     *
     * @family Combobox
     * @param ComboboxListBoxProps
     * @returns ComboboxListBox
     */
    List: ComboboxListBox,
    /**
     * Combobox button trigger.
     *
     * @family Combobox
     */
    Button: ComboboxButton,
} as const;

/**
 *
 * A Combobox is a combination of two components:
 * * An input to enter the user's value
 * * A popover with a list of suggestions to fill the value.
 *
 * These two components are included via the Combobox.Input and Combobox.ListBox components.
 *
 * In its simplest implementation the component will automatically filter the given options
 * from the value of the input and fill the input with the textValue of the selected option.
 *
 * Props are available for more complex implementations.
 *
 * @family Combobox
 * @param ComboboxProps
 * @returns Combobox
 */
export const Combobox = Object.assign(BaseCombobox, SUB_COMPONENTS);
