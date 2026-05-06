import { describe, expect, it } from 'vitest';

import { toggleSelection } from './toggleSelection';

const FRUITS = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
];

describe('toggleSelection', () => {
    describe('single mode', () => {
        it('returns the matched option for a known id', () => {
            const result = toggleSelection(FRUITS, 'id', undefined, 'banana', false);
            expect(result).toEqual(FRUITS[1]);
        });

        it('returns undefined for an unknown id', () => {
            const result = toggleSelection(FRUITS, 'id', FRUITS[0], 'kiwi', false);
            expect(result).toBeUndefined();
        });

        it('ignores currentValue', () => {
            const result = toggleSelection(FRUITS, 'id', FRUITS[0], 'cherry', false);
            expect(result).toEqual(FRUITS[2]);
        });
    });

    describe('multi mode', () => {
        it('appends a new option when the id is not in the current array', () => {
            const result = toggleSelection(FRUITS, 'id', [FRUITS[0]], 'banana', true);
            expect(result).toEqual([FRUITS[0], FRUITS[1]]);
        });

        it('removes the option when the id is already in the current array', () => {
            const result = toggleSelection(FRUITS, 'id', [FRUITS[0], FRUITS[1]], 'apple', true);
            expect(result).toEqual([FRUITS[1]]);
        });

        it('starts from an empty array when currentValue is undefined', () => {
            const result = toggleSelection(FRUITS, 'id', undefined, 'apple', true);
            expect(result).toEqual([FRUITS[0]]);
        });

        it('returns the current array unchanged for an unknown id (custom action)', () => {
            const current = [FRUITS[0]];
            const result = toggleSelection(FRUITS, 'id', current, 'kiwi', true);
            expect(result).toEqual(current);
        });

        it('treats a single (non-array) currentValue as empty', () => {
            // Defensive: if a consumer passes a stale single value into multi mode.
            const result = toggleSelection(FRUITS, 'id', FRUITS[0] as any, 'banana', true);
            expect(result).toEqual([FRUITS[1]]);
        });

        it('does not mutate the input array', () => {
            const current = [FRUITS[0], FRUITS[1]];
            toggleSelection(FRUITS, 'id', current, 'apple', true);
            expect(current).toEqual([FRUITS[0], FRUITS[1]]);
        });
    });
});
