import { FitAnchorWidth } from '../constants';

/**
 * Parse the fitToAnchorWidth option into the CSS property name to apply.
 */
export function parseFitWidth(fitToAnchorWidth?: string | boolean): string | undefined {
    if (!fitToAnchorWidth) return undefined;
    if (typeof fitToAnchorWidth === 'string') return fitToAnchorWidth;
    return FitAnchorWidth.MIN_WIDTH;
}
