import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckCircle, mdiRadioboxBlank } from '@lumx/icons';

import { Icon } from '../Icon';

export interface ListboxOptionSelectionIconProps {
    /** Selection type of the select (`undefined` renders nothing). */
    selectionType: 'single' | 'multiple' | undefined;
    /** Whether the option is selected. */
    isSelected: boolean;
}

/**
 * Selection state icon of an option. The icon is always rendered after the label.
 *
 * - `single`: a check circle icon when selected, a blank radio icon otherwise.
 * - `multiple`: a checkbox icon, marked or blank.
 */
export const ListboxOptionSelectionIcon = ({ selectionType, isSelected }: ListboxOptionSelectionIconProps) => {
    let icon: string;
    if (selectionType === 'multiple') {
        icon = isSelected ? mdiCheckboxMarked : mdiCheckboxBlankOutline;
    } else if (selectionType === 'single') {
        icon = isSelected ? mdiCheckCircle : mdiRadioboxBlank;
    } else {
        return null;
    }
    return (
        <Icon icon={icon} color={isSelected ? 'primary' : undefined} className="lumx-combobox-option__selection-icon" />
    );
};
