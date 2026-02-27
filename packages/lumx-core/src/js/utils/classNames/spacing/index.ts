import classnames from 'classnames';

import type { Direction, Spacing } from '@lumx/core/js/types';
import type { AbstractSize } from '@lumx/core/js/constants';

/**
 * Returns a lumx classname for the given type, direction and size. For example, for
 * arguments type='padding', direction='right', size='regular' it returns lumx-spacing-padding-right-regular
 * @param type - margin or padding
 * @param direction - Direction
 * @param size - Size
 * @returns string
 */
export function spacing(type: Spacing, direction?: Direction, size?: AbstractSize | null): string {
    let baseClass = `lumx-spacing-${type}`;

    if (direction && direction !== 'all') {
        baseClass = `${baseClass}-${direction}`;
    }

    if (size) {
        baseClass = `${baseClass}-${size}`;
    } else if (size === null) {
        baseClass = `${baseClass}-none`;
    }

    return baseClass;
}

/**
 * Returns a list of lumx classnames for the given types, directions and sizes. For example, for
 * arguments [
 *  { type: 'padding', direction: 'right', size: 'regular'},
 *  { type: 'margin', direction: 'left', size: 'big'},
 * ]
 * it returns lumx-spacing-padding-right-regular lumx-spacing-margin-left-big
 * @param spacingConfigs - Array of spacing configurations with direction and size
 * @returns string
 */
export const spacings = (spacingConfigs: { type: Spacing; direction?: Direction; size?: AbstractSize | null }[]) =>
    classnames(spacingConfigs.map((spa) => spacing(spa.type, spa.direction, spa.size)));

/**
 * Returns a lumx margin classname for the given direction and size. For example, for
 * arguments direction='right', size='regular' it returns lumx-spacing-margin-right-regular
 * @param direction - Direction
 * @param size - Size
 * @returns string
 */
export const margin = (direction?: Direction, size?: AbstractSize | null) => spacing('margin', direction, size);

/**
 * Returns a list of lumx margin classnames for the given directions and sizes. For example, for
 * arguments [
 *  { direction: 'right', size: 'regular'},
 *  { direction: 'left', size: 'big'},
 * ]
 * it returns lumx-spacing-margin-right-regular lumx-spacing-margin-left-big
 * @param marginConfigs - Array of padding configurations with direction and size
 * @returns string
 */
export const margins = (marginConfigs: { direction?: Direction; size?: AbstractSize | null }[]) =>
    spacings(marginConfigs.map(({ direction, size }) => ({ type: 'margin', direction, size })));

/**
 * Returns a lumx padding classname for the given direction and size. For example, for
 * arguments direction='right', size='regular' it returns lumx-spacing-padding-right-regular
 * @param direction - Direction
 * @param size - Size
 * @returns string
 */
export const padding = (direction?: Direction, size?: AbstractSize | null) => spacing('padding', direction, size);

/**
 * Returns a list of lumx padding classnames for the given directions and sizes. For example, for
 * arguments [
 *  { direction: 'right', size: 'regular'},
 *  { direction: 'left', size: 'big'},
 * ]
 * it returns lumx-spacing-padding-right-regular lumx-spacing-padding-left-big
 * @param paddingConfigs - Array of padding configurations with direction and size
 * @returns Combined padding classnames as a string
 */
export const paddings = (paddingConfigs: { direction?: Direction; size?: AbstractSize | null }[]) =>
    spacings(paddingConfigs.map(({ direction, size }) => ({ type: 'padding', direction, size })));
