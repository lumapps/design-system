import { KeyDirection, LoopAroundByAxis } from '../types';

/** Check whether the list should vertically loop with the given configuration  */
export function shouldLoopListVertically(direction: KeyDirection, loopAround: Pick<LoopAroundByAxis, 'col'>): boolean {
    return (
        (direction === 'vertical' && loopAround?.col !== 'next-end') ||
        (direction === 'both' && loopAround?.col !== 'next-end')
    );
}
