import { ComboboxSelectionIcon as UI } from '@lumx/core/js/components/Combobox/ComboboxSelectionIcon';
import { useComboboxListContext } from './context/ComboboxListContext';
import { useComboboxOptionContext } from './context/ComboboxOptionContext';

/**
 * Combobox.SelectionIcon component.
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
export const ComboboxSelectionIcon = () => {
    const { isSelected } = useComboboxOptionContext();
    const { selectionType } = useComboboxListContext();
    return <UI selectionType={selectionType} isSelected={isSelected} />;
};
ComboboxSelectionIcon.displayName = 'ComboboxSelectionIcon';
