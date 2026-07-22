import { resolveAccessibleNameProps } from './resolveAccessibleNameProps';

describe('resolveAccessibleNameProps', () => {
    it('should return aria-label when only a label is provided', () => {
        expect(resolveAccessibleNameProps('My label', undefined)).toEqual({ 'aria-label': 'My label' });
    });

    it('should return aria-labelledby when only a labelledby is provided', () => {
        expect(resolveAccessibleNameProps(undefined, 'header-id')).toEqual({ 'aria-labelledby': 'header-id' });
    });

    it('should prefer aria-label over aria-labelledby when both are provided', () => {
        expect(resolveAccessibleNameProps('My label', 'header-id')).toEqual({ 'aria-label': 'My label' });
    });

    it('should return undefined when neither is provided', () => {
        expect(resolveAccessibleNameProps(undefined, undefined)).toBeUndefined();
    });

    it('should ignore an empty-string label and fall back to labelledby', () => {
        expect(resolveAccessibleNameProps('', 'header-id')).toEqual({ 'aria-labelledby': 'header-id' });
    });
});
