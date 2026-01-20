import { LOOP_AROUND_TYPES } from '../constants';
import { LoopAround, LoopAroundByAxis } from '../types';

/**
 * Build a loopAround configuration to ensure both row and col behavior are set.
 *
 * Setting a boolean will set the following behaviors:
 *
 * * true => { row: 'next-loop', col: 'next-loop' }
 * * false => { row: 'next-end', col: 'next-end' }
 */
export function buildLoopAroundObject(loopAround?: LoopAround): LoopAroundByAxis {
    if (typeof loopAround === 'boolean' || loopAround === undefined) {
        const newLoopAround: LoopAround = loopAround
            ? { row: LOOP_AROUND_TYPES.nextLoop, col: LOOP_AROUND_TYPES.nextLoop }
            : { row: LOOP_AROUND_TYPES.nextEnd, col: LOOP_AROUND_TYPES.nextEnd };

        return newLoopAround;
    }
    return loopAround;
}
