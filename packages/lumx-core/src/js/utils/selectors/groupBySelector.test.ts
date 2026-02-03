import { groupBySelector } from './groupBySelector';

describe(groupBySelector, () => {
    it('should group items by a string property selector', () => {
        const items = [
            { id: 1, category: 'fruit', name: 'apple' },
            { id: 2, category: 'vegetable', name: 'carrot' },
            { id: 3, category: 'fruit', name: 'banana' },
            { id: 4, category: 'vegetable', name: 'broccoli' },
        ];

        const result = groupBySelector(items, 'category');

        expect(result.size).toBe(2);
        expect(result.get('fruit')).toEqual([
            { id: 1, category: 'fruit', name: 'apple' },
            { id: 3, category: 'fruit', name: 'banana' },
        ]);
        expect(result.get('vegetable')).toEqual([
            { id: 2, category: 'vegetable', name: 'carrot' },
            { id: 4, category: 'vegetable', name: 'broccoli' },
        ]);
    });

    it('should group items by a function selector', () => {
        const items = [
            { id: 1, age: 25 },
            { id: 2, age: 35 },
            { id: 3, age: 28 },
            { id: 4, age: 42 },
        ];

        const ageGroupSelector = (item: (typeof items)[0]) => (item.age < 30 ? 'young' : 'old');
        const result = groupBySelector(items, ageGroupSelector);

        expect(result.size).toBe(2);
        expect(result.get('young')).toEqual([
            { id: 1, age: 25 },
            { id: 3, age: 28 },
        ]);
        expect(result.get('old')).toEqual([
            { id: 2, age: 35 },
            { id: 4, age: 42 },
        ]);
    });

    it('should handle empty array', () => {
        const items: Array<{ id: number }> = [];
        const result = groupBySelector(items, 'id');

        expect(result.size).toBe(0);
    });

    it('should handle single item', () => {
        const items = [{ id: 1, type: 'test' }];
        const result = groupBySelector(items, 'type');

        expect(result.size).toBe(1);
        expect(result.get('test')).toEqual([{ id: 1, type: 'test' }]);
    });

    it('should group by numeric keys', () => {
        const items = [
            { id: 1, priority: 1 },
            { id: 2, priority: 2 },
            { id: 3, priority: 1 },
            { id: 4, priority: 3 },
        ];

        const result = groupBySelector(items, 'priority');

        expect(result.size).toBe(3);
        expect(result.get(1)).toEqual([
            { id: 1, priority: 1 },
            { id: 3, priority: 1 },
        ]);
        expect(result.get(2)).toEqual([{ id: 2, priority: 2 }]);
        expect(result.get(3)).toEqual([{ id: 4, priority: 3 }]);
    });

    it('should group by boolean keys', () => {
        const items = [
            { id: 1, active: true },
            { id: 2, active: false },
            { id: 3, active: true },
            { id: 4, active: false },
        ];

        const result = groupBySelector(items, 'active');

        expect(result.size).toBe(2);
        expect(result.get(true)).toEqual([
            { id: 1, active: true },
            { id: 3, active: true },
        ]);
        expect(result.get(false)).toEqual([
            { id: 2, active: false },
            { id: 4, active: false },
        ]);
    });

    it('should group by object keys using function selector', () => {
        const tag1 = { name: 'important' };
        const tag2 = { name: 'urgent' };

        const items = [
            { id: 1, tag: tag1 },
            { id: 2, tag: tag2 },
            { id: 3, tag: tag1 },
        ];

        const result = groupBySelector(items, (item) => item.tag);

        expect(result.size).toBe(2);
        expect(result.get(tag1)).toEqual([
            { id: 1, tag: tag1 },
            { id: 3, tag: tag1 },
        ]);
        expect(result.get(tag2)).toEqual([{ id: 2, tag: tag2 }]);
    });

    it('should handle all items in single group', () => {
        const items = [
            { id: 1, status: 'active' },
            { id: 2, status: 'active' },
            { id: 3, status: 'active' },
        ];

        const result = groupBySelector(items, 'status');

        expect(result.size).toBe(1);
        expect(result.get('active')).toEqual(items);
    });

    it('should handle complex selector transformations', () => {
        const items = [
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Doe' },
            { firstName: 'Bob', lastName: 'Smith' },
        ];

        const result = groupBySelector(items, (item) => item.lastName);

        expect(result.size).toBe(2);
        expect(result.get('Doe')).toHaveLength(2);
        expect(result.get('Smith')).toHaveLength(1);
    });

    it('should preserve item order within groups', () => {
        const items = [
            { id: 1, type: 'A' },
            { id: 2, type: 'B' },
            { id: 3, type: 'A' },
            { id: 4, type: 'B' },
            { id: 5, type: 'A' },
        ];

        const result = groupBySelector(items, 'type');

        expect(result.get('A')).toEqual([
            { id: 1, type: 'A' },
            { id: 3, type: 'A' },
            { id: 5, type: 'A' },
        ]);
        expect(result.get('B')).toEqual([
            { id: 2, type: 'B' },
            { id: 4, type: 'B' },
        ]);
    });

    it('should handle null and undefined values as keys', () => {
        const items = [
            { id: 1, value: null },
            { id: 2, value: undefined },
            { id: 3, value: null },
            { id: 4, value: 'test' },
        ];

        const result = groupBySelector(items, 'value');

        expect(result.size).toBe(3);
        expect(result.get(null)).toHaveLength(2);
        expect(result.get(undefined)).toHaveLength(1);
        expect(result.get('test')).toHaveLength(1);
    });
});
