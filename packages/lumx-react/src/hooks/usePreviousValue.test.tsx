import { render } from '@testing-library/react';
import { usePreviousValue } from './usePreviousValue';

describe('usePreviousValue', () => {
    it('should return undefined on first render', () => {
        let result: any;
        const TestComponent = ({ val }: any) => {
            result = usePreviousValue(val);
            return null;
        };
        render(<TestComponent val="initial" />);
        expect(result).toBeUndefined();
    });

    it('should return previous value after update', () => {
        let result: any;
        const TestComponent = ({ val }: any) => {
            result = usePreviousValue(val);
            return null;
        };
        const { rerender } = render(<TestComponent val="first" />);

        expect(result).toBeUndefined();

        rerender(<TestComponent val="second" />);
        expect(result).toBe('first');

        rerender(<TestComponent val="third" />);
        expect(result).toBe('second');
    });
});
