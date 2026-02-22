import { findOptionById } from './findOptionById';

interface Fruit {
    id: string;
    name: string;
}

const apple: Fruit = { id: 'apple', name: 'Apple' };
const banana: Fruit = { id: 'banana', name: 'Banana' };
const fruits: Fruit[] = [apple, banana];

describe(findOptionById, () => {
    it('should find option by id using a function selector', () => {
        expect(findOptionById(fruits, (f) => f.id, 'banana')).toBe(banana);
    });

    it('should find option by id using a string selector', () => {
        expect(findOptionById(fruits, 'id', 'apple')).toBe(apple);
    });

    it('should return undefined when no option matches', () => {
        expect(findOptionById(fruits, 'id', 'cherry')).toBeUndefined();
    });

    it('should return undefined when options is undefined', () => {
        expect(findOptionById<Fruit>(undefined, 'id', 'apple')).toBeUndefined();
    });

    it('should return undefined when options is empty', () => {
        expect(findOptionById([], 'id', 'apple')).toBeUndefined();
    });

    it('should return undefined when id is null/undefined (skip lookup)', () => {
        expect(findOptionById(fruits, 'id', undefined)).toBeUndefined();
        expect(findOptionById(fruits, 'id', null)).toBeUndefined();
    });

    it('should match using strict equality (no type coercion)', () => {
        const numeric = [{ id: 1 }, { id: 2 }];
        expect(findOptionById(numeric, (o) => o.id as any, 1)).toBe(numeric[0]);
        expect(findOptionById(numeric, (o) => o.id as any, '1')).toBeUndefined();
    });
});
