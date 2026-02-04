import { Alignment, HorizontalAlignment, Size, VerticalAlignment } from '../../constants';

export type MarginAutoAlignment = Extract<Alignment, 'top' | 'bottom' | 'right' | 'left'>;
export type GapSize = Extract<Size, 'tiny' | 'regular' | 'medium' | 'big' | 'huge'>;
type SpaceAlignment = Extract<Alignment, 'space-between' | 'space-evenly' | 'space-around'>;
export type FlexVerticalAlignment = VerticalAlignment | SpaceAlignment;
export type FlexHorizontalAlignment = HorizontalAlignment | SpaceAlignment;
