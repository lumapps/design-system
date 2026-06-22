import { type Placement as FloatingPlacement } from '@floating-ui/dom';
import { type Placement } from '../constants';

/**
 * Parse a Popover placement into floating-ui placement or auto-placement config.
 */
export function parseAutoPlacement(placement?: Placement) {
    if (placement === 'auto') return { isAuto: true as const };
    if (placement === 'auto-start') return { isAuto: true as const, autoAlignment: 'start' as const };
    if (placement === 'auto-end') return { isAuto: true as const, autoAlignment: 'end' as const };
    return { floatingPlacement: placement as FloatingPlacement, isAuto: false as const };
}
