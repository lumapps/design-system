import { Alignment, Size } from '../../constants';

export const GAP_SIZES = [Size.tiny, Size.regular, Size.medium, Size.big, Size.huge];
export const SPACE_ALIGNMENTS = [Alignment.spaceBetween, Alignment.spaceEvenly, Alignment.spaceAround];
export const VERTICAL_ALIGNMENTS = [...SPACE_ALIGNMENTS, Alignment.top, Alignment.center, Alignment.bottom];
export const HORIZONTAL_ALIGNMENTS = [...SPACE_ALIGNMENTS, Alignment.left, Alignment.center, Alignment.right];
