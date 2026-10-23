import { defineComponent } from 'vue';

import { ListboxOptionSelectionIcon as UI } from '@lumx/core/js/components/Composite/CompositeSelectionIcon';

import { getName } from '../../utils/VueToJSX';
import { useListboxContext } from '../composite/CompositeContext';
import { useListboxOptionContext } from '../composite/CompositeItemContext';

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
 * @return Vue element.
 */
const ListboxOptionSelectionIcon = defineComponent(
    () => {
        const optionContext = useListboxOptionContext();
        const listContext = useListboxContext();
        return () =>
            UI({
                selectionType: listContext.selectionType,
                isSelected: optionContext.isSelected,
            });
    },
    {
        name: getName('ComboboxSelectionIcon'),
        inheritAttrs: false,
        props: {},
    },
);

export default ListboxOptionSelectionIcon;
