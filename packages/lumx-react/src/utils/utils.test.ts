import partition from 'lodash/partition';
import { partitionMulti } from '.';
import { isInternetExplorer } from './isInternetExplorer';

describe(`partitionMulti`, () => {
    it('should act like partition for single predicate', () => {
        const data = [0, 1, 2, 3, 4, 5];
        const isEven = (n: number): boolean => n % 2 === 0;

        const expected = partition(data, isEven);
        const actual = partitionMulti(data, [isEven]);

        expect(actual).toEqual(expected);
    });

    it('should partition on multiple predicates', () => {
        type T = string | number | boolean;
        const data: T[] = ['a', 1, 'b', false, true];
        const isString = (s: T): boolean => typeof s === 'string';
        const isNumber = (s: T): boolean => typeof s === 'number';

        const [strings, numbers, others] = partitionMulti(data, [isString, isNumber]);

        expect(strings).toEqual(['a', 'b']);
        expect(numbers).toEqual([1]);
        expect(others).toEqual([false, true]);
    });
});

describe(`isInternetExplorer`, () => {
    it('should detect IE 10', () => {
        const userAgentIE10 = `Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)`;
        Object.defineProperty(window.navigator, 'userAgent', { value: userAgentIE10, configurable: true });
        expect(isInternetExplorer()).toEqual(true);
    });

    it('should detect IE 11', () => {
        const userAgentIE11 = `Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko`;
        Object.defineProperty(window.navigator, 'userAgent', { value: userAgentIE11, configurable: true });
        expect(isInternetExplorer()).toEqual(true);
    });

    it('should not detect IE', () => {
        const userAgentFirefox = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:74.0) Gecko/20100101 Firefox/74.0`;
        Object.defineProperty(window.navigator, 'userAgent', { value: userAgentFirefox, configurable: true });
        expect(isInternetExplorer()).toEqual(false);
    });
});
