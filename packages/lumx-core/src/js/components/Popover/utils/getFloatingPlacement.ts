import { type Placement as FloatingPlacement } from '@floating-ui/dom';
import { type parseAutoPlacement } from './parseAutoPlacement';

/**
 * Get the floating-ui placement from the parsed placement config.
 * Returns undefined for auto-placement (floating-ui handles it via autoPlacement middleware).
 */
export function getFloatingPlacement(
    parsedPlacement: ReturnType<typeof parseAutoPlacement>,
): FloatingPlacement | undefined {
    return parsedPlacement.isAuto ? undefined : parsedPlacement.floatingPlacement;
}
