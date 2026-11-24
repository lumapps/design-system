import { mdiCheck } from '@lumx/icons';

import type { HasClassName } from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';

/**
 * Component default class name.
 */
export const CLASSNAME = 'lumx-composite-item__selection-icon' as const;

/** Class names of the previous versions on a listbox option, kept for compatibility (set by the option icon). */
export const LEGACY_OPTION_CLASSNAME = 'lumx-listbox-option__selection-icon lumx-combobox-option__selection-icon';

export interface CompositeSelectionIconProps extends HasClassName {
    /** Selection type of the select (`undefined` renders nothing). */
    selectionType: 'single' | 'multiple' | undefined;
    /** Whether the item is selected. */
    isSelected: boolean;
}

/**
 * Selection state icon of a composite item (an option or a tree item). The icon is always rendered after the label.
 *
 * A check icon when selected, else an empty icon that keeps the item contents aligned (in `single` and `multiple`
 * selection).
 */
export const CompositeSelectionIcon = ({ selectionType, isSelected, className }: CompositeSelectionIconProps) => {
    if (!selectionType) return null;
    return (
        <Icon
            icon={isSelected ? mdiCheck : ''}
            color={isSelected ? 'primary' : undefined}
            className={classNames.join(CLASSNAME, className)}
        />
    );
};
