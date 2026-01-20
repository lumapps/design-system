import { TabStop } from '../types';

/** Check if the given tab stop is enabled */
export const tabStopIsEnabled = (tabStop: TabStop) => !tabStop.disabled;
