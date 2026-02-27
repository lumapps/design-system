import classnames from 'classnames';

import type { Direction, Spacing } from '@lumx/core/js/types';
import { Size, type AbstractSize } from '@lumx/core/js/constants';

/** Set of valid AbstractSize values for runtime detection. */
const ABSTRACT_SIZES: ReadonlySet<string> = new Set([Size.tiny, Size.regular, Size.medium, Size.big, Size.huge]);

function isAbstractSize(value: unknown): value is AbstractSize {
    return typeof value === 'string' && ABSTRACT_SIZES.has(value);
}

/**
 * Returns a lumx classname for the given type, direction and size. For example, for
 * arguments type='padding', direction='right', size='regular' it returns lumx-spacing-padding-right-regular
 * @param type - margin or padding
 * @param direction - Direction
 * @param size - Size
 * @returns string
 */
export function spacing(type: Spacing, size: AbstractSize | null): string;
export function spacing(type: Spacing, direction?: Direction, size?: AbstractSize | null): string;
export function spacing(
    type: Spacing,
    directionOrSize?: Direction | AbstractSize | null,
    size?: AbstractSize | null,
): string {
    // Resolve shorthand: spacing(type, size) => spacing(type, undefined, size)
    const isShorthand = isAbstractSize(directionOrSize) || (directionOrSize === null && size === undefined);
    const direction: Direction | undefined = isShorthand ? undefined : directionOrSize ?? undefined;
    const resolvedSize: AbstractSize | null | undefined = isShorthand ? directionOrSize : size;

    let baseClass = `lumx-spacing-${type}`;

    if (direction && direction !== 'all') {
        baseClass = `${baseClass}-${direction}`;
    }

    if (resolvedSize) {
        baseClass = `${baseClass}-${resolvedSize}`;
    } else if (resolvedSize === null) {
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
 *
 * Can also be called with just a size: margin('regular') is equivalent to margin('all', 'regular').
 * @param direction - Direction
 * @param size - Size
 * @returns string
 */
export function margin(size: AbstractSize | null): string;
export function margin(direction?: Direction, size?: AbstractSize | null): string;
export function margin(directionOrSize?: Direction | AbstractSize | null, size?: AbstractSize | null): string {
    if (isAbstractSize(directionOrSize) || (directionOrSize === null && size === undefined)) {
        return spacing('margin', directionOrSize);
    }
    return spacing('margin', directionOrSize ?? undefined, size);
}

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
 *
 * Can also be called with just a size: padding('regular') is equivalent to padding('all', 'regular').
 * @param direction - Direction
 * @param size - Size
 * @returns string
 */
export function padding(size: AbstractSize | null): string;
export function padding(direction?: Direction, size?: AbstractSize | null): string;
export function padding(directionOrSize?: Direction | AbstractSize | null, size?: AbstractSize | null): string {
    if (isAbstractSize(directionOrSize) || (directionOrSize === null && size === undefined)) {
        return spacing('padding', directionOrSize);
    }
    return spacing('padding', directionOrSize ?? undefined, size);
}

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
