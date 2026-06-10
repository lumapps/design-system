import { setup } from '@lumx/core/js/components/Menu/MenuButtonTestStories';

import { MenuItem } from './MenuItem';
import { MenuButton } from './MenuButton';

const { meta, ...testStories } = setup({
    components: { MenuButton, MenuItem },
});

export default { ...meta, title: 'LumX components/menu/MenuButton/Tests' };

export const TabFromLastItemClosesAndMovesFocus = { ...testStories.TabFromLastItemClosesAndMovesFocus };
export const ShiftTabFromFirstItemClosesAndReturnsToTrigger = {
    ...testStories.ShiftTabFromFirstItemClosesAndReturnsToTrigger,
};
export const EscapeRestoresFocusToTrigger = { ...testStories.EscapeRestoresFocusToTrigger };
export const ItemActivationRestoresFocusToTrigger = { ...testStories.ItemActivationRestoresFocusToTrigger };
export const ClickAwayClosesMenu = { ...testStories.ClickAwayClosesMenu };
