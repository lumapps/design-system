import { getRootClassName } from './getRootClassName';

describe(getRootClassName, () => {
    it('should transform the component name into a lumx class', () => {
        expect(getRootClassName('Table')).toBe('lumx-table');
    });

    it('should transform the sub component name into a lumx class', () => {
        expect(getRootClassName('TableBody', true)).toBe('lumx-table__body');
    });
});
