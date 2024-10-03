import { POPOVER_ZINDEX } from '../popover/constants';

export const ARIA_LINK_MODES = ['aria-describedby', 'aria-labelledby'] as const;

/**
 * Make sure tooltip appear above popovers.
 */
export const TOOLTIP_ZINDEX = POPOVER_ZINDEX + 1;
