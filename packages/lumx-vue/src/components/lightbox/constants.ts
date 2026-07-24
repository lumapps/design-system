import { keysOf } from '../../utils/VueToJSX';

import type { LightboxProps } from './types';

/** Emit contract, shared by the `Lightbox` wrapper and `LightboxContent`. */
export const emitSchema = {
    close: () => true,
};

/** Public prop names, shared by the `Lightbox` wrapper and `LightboxContent`. */
export const LIGHTBOX_PROP_KEYS = keysOf<LightboxProps>()(
    'class',
    'closeButtonProps',
    'focusElement',
    'isOpen',
    'parentElement',
    'preventAutoClose',
    'preventCloseOnClick',
    'zIndex',
);
