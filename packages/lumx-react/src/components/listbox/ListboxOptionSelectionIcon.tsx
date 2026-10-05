import { ListboxOptionSelectionIcon as UI } from '@lumx/core/js/components/Listbox/ListboxOptionSelectionIcon';
import { useListboxContext } from './context/ListboxContext';
import { useListboxOptionContext } from './context/ListboxOptionContext';

/**
 * Combobox.SelectionIcon component (`Listbox.SelectionIcon`, re-exported by the combobox).
 *
 * Displays the selection state icon of an option (the same icon as in `SelectTextField` and `SelectButton`):
 * - `single` list: a check circle icon when selected, a blank radio icon otherwise.
 * - `multiple` list (`aria-multiselectable` on `Combobox.List`): a checkbox icon, marked or blank.
 *
 * The option selected state (`isSelected`) and the list selection type are read from the parent context.
 * Must be placed in the `after` slot of a `Combobox.Option`.
 *
 * @return React element.
 */
export const ListboxOptionSelectionIcon = () => {
    const { isSelected } = useListboxOptionContext();
    const { selectionType } = useListboxContext();
    return <UI selectionType={selectionType} isSelected={isSelected} />;
};
ListboxOptionSelectionIcon.displayName = 'ComboboxSelectionIcon';
