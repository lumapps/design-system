import { GlobalSize, Size } from '../../../constants/enums';
import type { VarSize } from './types';

/** Resolve a t-shirt size token to its CSS custom property, or pass through as-is. */
export function resolveCssSize<V extends string | undefined>(value: V): V extends GlobalSize ? VarSize<V> : V;
export function resolveCssSize(value: any) {
    if (value && value in Size) return `var(--lumx-size-${value})`;
    return value;
}
