import { ClassValue } from 'classnames/types';

/**
 * Modifier
 * @example { 'is-disabled': true, 'is-selected': false }
 */
export type Modifier = Record<string, boolean | undefined | null>;

/**
 * Additional classes that can be passed as a single string shorthand
 * or an array of class values.
 */
export type AdditionalClasses = string | ClassValue[];
