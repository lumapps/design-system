import { KeyDirection, LoopAroundByAxis } from '../types';

/** Check whether the list should horizontally loop with the given configuration  */
export function shouldLoopListHorizontally(
    direction: KeyDirection,
    loopAround: Pick<LoopAroundByAxis, 'row'>,
): boolean {
    return (
        (direction === 'horizontal' && loopAround?.row !== 'next-end') ||
        (direction === 'both' && loopAround?.row !== 'next-end')
    );
}
