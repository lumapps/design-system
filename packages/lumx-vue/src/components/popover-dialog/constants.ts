import { keysOf } from '../../utils/VueToJSX';

import type { PopoverDialogProps } from './types';

/** Emit contract, shared by the `PopoverDialog` wrapper and `PopoverDialogContent`. */
export const emitSchema = {
    close: () => true,
    /** Model update for `v-model:is-open`. Only ever sends `false`: the app opens the popover itself. */
    'update:isOpen': (isOpen: boolean) => typeof isOpen === 'boolean',
};

/** Public prop names, shared by the `PopoverDialog` wrapper and `PopoverDialogContent`. */
export const POPOVER_DIALOG_PROP_KEYS = keysOf<PopoverDialogProps>()(
    'anchorRef',
    'aria-label',
    'aria-labelledby',
    'as',
    'boundaryRef',
    'closeMode',
    'closeOnClickAway',
    'closeOnEscape',
    'elevation',
    'fitToAnchorWidth',
    'fitWithinViewportHeight',
    'focusAnchorOnClose',
    'focusElement',
    'hasArrow',
    'width',
    'minWidth',
    'maxWidth',
    'height',
    'minHeight',
    'maxHeight',
    'isOpen',
    'label',
    'offset',
    'parentElement',
    'placement',
    'usePortal',
    'focusTrapZoneElement',
    'withFocusTrap',
    'zIndex',
    'theme',
    'class',
);
