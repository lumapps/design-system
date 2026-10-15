import type { LumxClassName } from '../../types';
import { VHSize } from '../../utils/browser/css/types';

export const DEFAULT_COMBOBOX_POPOVER_MAX_HEIGHT: VHSize = '80vh';

export const COMBOBOX_PROVIDER_COMPONENT_NAME = 'ComboboxProvider';

/** Class name of the `Combobox.Popover` (a listbox outside of it is inline, always open). */
export const COMBOBOX_POPOVER_CLASSNAME: LumxClassName<'ComboboxPopover'> = 'lumx-combobox-popover';
