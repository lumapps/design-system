import { defineComponent } from 'vue';

import { ComboboxSelectionIcon as UI } from '@lumx/core/js/components/Combobox/ComboboxSelectionIcon';

import { getName } from '../../utils/VueToJSX';
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
 * @return Vue element.
 */
const ComboboxSelectionIcon = defineComponent(
    () => {
        const optionContext = useComboboxOptionContext();
        const listContext = useComboboxListContext();
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

export default ComboboxSelectionIcon;
