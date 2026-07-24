import { type BaseLightboxProps } from '@lumx/core/js/components/Lightbox';

import { type VueToJSXProps } from '../../utils/VueToJSX';

/**
 * Vue Lightbox props.
 * `theme`, `aria-label` and `aria-labelledby` are not declared props - they pass through via attrs.
 */
export type LightboxProps = VueToJSXProps<BaseLightboxProps, 'theme' | 'aria-label' | 'aria-labelledby'> & {
    /** Reference to the element that triggered lightbox opening (gets focus back on close). */
    parentElement?: HTMLElement;
    /** Element that should receive focus when the lightbox opens. By default the first focusable child. */
    focusElement?: HTMLElement;
    /** Props to pass to the close button. */
    closeButtonProps?: any;
};
