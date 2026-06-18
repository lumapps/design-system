import type { GlobalSize } from '../../../constants/enums';

/** Viewport-relative height value, e.g. `50vh`. */
export type VHSize = `${number}vh`;

/** Pixel value, e.g. `12px`. */
export type PXSize = `${number}px`;

/** CSS custom property referencing a LumX t-shirt size token, e.g. `var(--lumx-size-m)`. */
export type VarSize<S extends GlobalSize = GlobalSize> = `var(--lumx-size-${S})`;
