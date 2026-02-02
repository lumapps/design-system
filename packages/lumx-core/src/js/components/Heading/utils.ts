import { MAX_HEADING_LEVEL } from './constants';

/**
 * Computes the next heading level based on the optional prop level or the parent context level.
 *
 * @param levelProp - The explicit level provided via props (optional).
 * @param parentLevel - The level from the parent context.
 * @returns The calculated heading level, clamped to the maximum allowed level.
 */
export const computeHeadingLevel = (levelProp: number | undefined, parentLevel: number): number => {
    const nextLevel = levelProp || parentLevel + 1;
    return nextLevel > MAX_HEADING_LEVEL ? MAX_HEADING_LEVEL : nextLevel;
};
