import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckCircle, mdiRadioboxBlank } from '@lumx/icons';

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
 * - `single`: a check circle icon when selected, a blank radio icon otherwise.
 * - `multiple`: a checkbox icon, marked or blank.
 */
export const CompositeSelectionIcon = ({ selectionType, isSelected, className }: CompositeSelectionIconProps) => {
    let icon: string;
    if (selectionType === 'multiple') {
        icon = isSelected ? mdiCheckboxMarked : mdiCheckboxBlankOutline;
    } else if (selectionType === 'single') {
        icon = isSelected ? mdiCheckCircle : mdiRadioboxBlank;
    } else {
        return null;
    }
    return (
        <Icon
            icon={icon}
            color={isSelected ? 'primary' : undefined}
            className={classNames.join(CLASSNAME, className)}
        />
    );
};
