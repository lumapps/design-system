import type { OptionActiveEvent } from './types';

const OPTION_ACTIVE_EVENT_PREFIX = 'optionActive:' satisfies OptionActiveEvent;

/** The active state event of one item (see {@link OptionActiveEvent}). */
export const optionActiveEvent = (optionId: string): OptionActiveEvent => `${OPTION_ACTIVE_EVENT_PREFIX}${optionId}`;
export const isOptionActiveEvent = (event: string): event is OptionActiveEvent =>
    event.startsWith(OPTION_ACTIVE_EVENT_PREFIX);
/** The item id of an active state event. */
export const getOptionActiveId = (event: OptionActiveEvent): string => event.slice(OPTION_ACTIVE_EVENT_PREFIX.length);
