import { Size } from '@lumx/react';

export type GenericBlockGapSize = Extract<Size, 'tiny' | 'regular' | 'medium' | 'big' | 'huge'>;

/**
 * Accepted gap sizes for the generic block.
 */
export const GenericBlockGapSize: { [S in GenericBlockGapSize]: S } = {
    tiny: Size.tiny,
    regular: Size.regular,
    medium: Size.medium,
    big: Size.big,
    huge: Size.huge,
};
