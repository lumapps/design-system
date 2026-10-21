import { defineComponent } from 'vue';

import {
    CompositeSelectionIcon as UI,
    LEGACY_OPTION_CLASSNAME,
} from '@lumx/core/js/components/Composite/CompositeSelectionIcon';

import { getName } from '../../utils/VueToJSX';
import { useCompositeContext } from '../composite/CompositeContext';
import { useCompositeItemContext } from '../composite/CompositeItemContext';

/**
 * Combobox.SelectionIcon component (`Listbox.SelectionIcon`, re-exported by the combobox).
 *
 * Displays the selection state icon of an option (the same icon as in `SelectTextField` and `SelectButton`):
 * a check icon when the option is selected, else an empty icon that keeps the option contents aligned.
 *
 * The option selected state (`isSelected`) is read from the parent context.
 * Must be placed in the `after` slot of a `Combobox.Option` (a `TreeListItem` renders its own selection icon).
 *
 * @return Vue element.
 */
const ListboxOptionSelectionIcon = defineComponent(
    () => {
        const optionContext = useCompositeItemContext();
        const listContext = useCompositeContext();
        return () => {
            if (optionContext.isSelectable === false) return null;
            return UI({
                selectionType: listContext.selectionType,
                isSelected: optionContext.isSelected,
                className: LEGACY_OPTION_CLASSNAME,
            });
        };
    },
    {
        name: getName('ComboboxSelectionIcon'),
        inheritAttrs: false,
        props: {},
    },
);

export default ListboxOptionSelectionIcon;
