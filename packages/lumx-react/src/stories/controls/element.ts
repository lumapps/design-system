import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { HeadingElement, TextElement } from '@lumx/react';

export const HEADING_ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as HeadingElement[];
export const headingElementArgType = getSelectArgType<HeadingElement>(HEADING_ELEMENTS);
export const textElementArgType = getSelectArgType<TextElement>(['p', 'span', ...HEADING_ELEMENTS]);
