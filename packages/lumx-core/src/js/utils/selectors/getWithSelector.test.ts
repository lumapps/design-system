import { getWithSelector } from './getWithSelector';

describe(getWithSelector, () => {
    it('should extract value using a function selector', () => {
        const obj = { id: 1, name: 'John', age: 30 };
        const selector = (o: typeof obj) => o.name;

        expect(getWithSelector(selector, obj)).toBe('John');
    });

    it('should extract value using a string selector', () => {
        const obj = { id: 1, name: 'John', age: 30 };
        const selector = 'age';

        expect(getWithSelector(selector, obj)).toBe(30);
    });

    it('should handle nested object access with function selector', () => {
        const obj = { user: { profile: { email: 'test@example.com' } } };
        const selector = (o: typeof obj) => o.user.profile.email;

        expect(getWithSelector(selector, obj)).toBe('test@example.com');
    });

    it('should convert object to string when selector is undefined', () => {
        const obj = { id: 1, name: 'John' };

        expect(getWithSelector(undefined, obj)).toBe('[object Object]');
    });

    it('should convert primitive to string when selector is undefined', () => {
        expect(getWithSelector(undefined, 42)).toBe('42');
        expect(getWithSelector(undefined, 'test')).toBe('test');
        expect(getWithSelector(undefined, true)).toBe('true');
    });

    it('should handle function selector returning different types', () => {
        const obj = { count: 100, active: true, price: 49.99 };

        expect(getWithSelector((o) => o.count, obj)).toBe(100);
        expect(getWithSelector((o) => o.active, obj)).toBe(true);
        expect(getWithSelector((o) => o.price, obj)).toBe(49.99);
    });

    it('should handle string selector with different property types', () => {
        const obj = { id: 'abc123', count: 0, enabled: false };

        expect(getWithSelector('id', obj)).toBe('abc123');
        expect(getWithSelector('count', obj)).toBe(0);
        expect(getWithSelector('enabled', obj)).toBe(false);
    });

    it('should handle complex transformations with function selector', () => {
        const obj = { firstName: 'John', lastName: 'Doe' };
        const selector = (o: typeof obj) => `${o.firstName} ${o.lastName}`;

        expect(getWithSelector(selector, obj)).toBe('John Doe');
    });

    it('should work with array objects', () => {
        const arr = [1, 2, 3, 4, 5];
        const selector = (a: typeof arr) => a.length;

        expect(getWithSelector(selector, arr)).toBe(5);
    });

    it('should handle null and undefined values with function selector', () => {
        const obj = { value: null, other: undefined };

        expect(getWithSelector((o) => o.value, obj)).toBe(null);
        expect(getWithSelector((o) => o.other, obj)).toBe(undefined);
    });
});
