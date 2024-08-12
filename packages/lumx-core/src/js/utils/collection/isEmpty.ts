import type { Falsy } from '../../types';

/** Check if object or array is empty (true on falsy values) */
export const isEmpty = (obj: {} | Falsy) => !obj || Object.entries(obj).length === 0;
