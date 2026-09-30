import { VHSize } from '../../utils/browser/css/types';
import { OptionActiveEvent } from './types';

export const DEFAULT_COMBOBOX_POPOVER_MAX_HEIGHT: VHSize = '80vh';

export const COMBOBOX_PROVIDER_COMPONENT_NAME = 'ComboboxProvider';

export const OPTION_ACTIVE_EVENT_PREFIX = 'optionActive:' as const;
export const optionActiveEvent = (optionId: string): OptionActiveEvent => `${OPTION_ACTIVE_EVENT_PREFIX}${optionId}`;
export const isOptionActiveEvent = (event: string): event is OptionActiveEvent =>
    event.startsWith(OPTION_ACTIVE_EVENT_PREFIX);
