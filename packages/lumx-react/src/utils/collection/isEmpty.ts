import { Falsy } from '../type';

/** Check if object or array is empty (true on falsy values) */
export const isEmpty = (obj: object | Falsy) => !obj || Object.entries(obj).length === 0;
