import type { OptionActiveEvent } from './types';

export const OPTION_ACTIVE_EVENT_PREFIX = 'optionActive:' as const;
export const optionActiveEvent = (optionId: string): OptionActiveEvent => `${OPTION_ACTIVE_EVENT_PREFIX}${optionId}`;
export const isOptionActiveEvent = (event: string): event is OptionActiveEvent =>
    event.startsWith(OPTION_ACTIVE_EVENT_PREFIX);
