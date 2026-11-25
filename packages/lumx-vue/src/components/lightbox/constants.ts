import { keysOf } from '../../utils/VueToJSX';

import type { LightboxProps } from './types';

/** Emit contract, shared by the `Lightbox` wrapper and `LightboxContent`. */
export const emitSchema = {
    close: () => true,
    /** Model update for `v-model:is-open`. Only ever sends `false`: the app opens the lightbox itself. */
    'update:isOpen': (isOpen: boolean) => typeof isOpen === 'boolean',
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
