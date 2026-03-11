import pick from 'lodash/pick';
import { Size } from '../../constants';
import { ValueOf } from '../../types';

/**
 * Accepted gap sizes for the generic block.
 */
export const GenericBlockGapSize = pick(Size, ['tiny', 'regular', 'medium', 'big', 'huge']);
export type GenericBlockGapSize = ValueOf<typeof GenericBlockGapSize>;
