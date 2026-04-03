import { getOptionDisplayName } from './getOptionDisplayName';

interface Fruit {
    id: number;
    name: string;
}

const apple: Fruit = { id: 1, name: 'Apple' };
const getOptionName = (fruit: Fruit) => fruit.name;
const getOptionId = (fruit: Fruit) => String(fruit.id);

describe(getOptionDisplayName, () => {
    it('should return empty string for undefined value', () => {
        expect(getOptionDisplayName(undefined, getOptionName, getOptionId)).toBe('');
    });

    it('should return empty string for null value', () => {
        // The function handles null at runtime even though the type only declares `undefined`.
        expect(getOptionDisplayName(null as unknown as undefined, getOptionName, getOptionId)).toBe('');
    });

    it('should use getOptionName when it returns a non-null value', () => {
        expect(getOptionDisplayName(apple, getOptionName, getOptionId)).toBe('Apple');
    });

    it('should fall back to getOptionId when getOptionName returns null', () => {
        const nullName = () => null;
        expect(getOptionDisplayName(apple, nullName, getOptionId)).toBe('1');
    });

    it('should fall back to getOptionId when getOptionName returns undefined', () => {
        const undefinedName = () => undefined;
        expect(getOptionDisplayName(apple, undefinedName, getOptionId)).toBe('1');
    });

    it('should use getOptionId when getOptionName is not provided', () => {
        expect(getOptionDisplayName(apple, undefined, getOptionId)).toBe('1');
    });

    it('should return empty string when neither selector is provided', () => {
        expect(getOptionDisplayName(apple)).toBe('');
    });

    it('should convert non-string getOptionId result to string', () => {
        // getOptionId accepts Selector<O> (defaults to string), but String() is called at runtime.
        const numericId = (fruit: Fruit) => fruit.id as any;
        expect(getOptionDisplayName(apple, undefined, numericId)).toBe('1');
    });

    it('should convert non-string getOptionName result to string', () => {
        const numericName = (fruit: Fruit) => fruit.id as any;
        expect(getOptionDisplayName(apple, numericName)).toBe('1');
    });

    it('should work with string selectors', () => {
        expect(getOptionDisplayName(apple, 'name' as any, 'id' as any)).toBe('Apple');
    });
});
