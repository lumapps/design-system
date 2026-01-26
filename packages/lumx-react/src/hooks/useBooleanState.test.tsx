import { render, act } from '@testing-library/react';
import { useBooleanState } from './useBooleanState';

describe('useBooleanState', () => {
    it('should initialize with default value', () => {
        let result: any;
        const TestComponent = ({ initialValue }: any) => {
            result = useBooleanState(initialValue);
            return null;
        };
        render(<TestComponent initialValue />);
        expect(result[0]).toBe(true);
    });

    it('should set to false', () => {
        let result: any;
        const TestComponent = ({ initialValue }: any) => {
            result = useBooleanState(initialValue);
            return null;
        };
        render(<TestComponent initialValue />);
        act(() => result[1]());
        expect(result[0]).toBe(false);
    });

    it('should set to true', () => {
        let result: any;
        const TestComponent = ({ initialValue }: any) => {
            result = useBooleanState(initialValue);
            return null;
        };
        render(<TestComponent initialValue={false} />);
        act(() => result[2]());
        expect(result[0]).toBe(true);
    });

    it('should toggle', () => {
        let result: any;
        const TestComponent = ({ initialValue }: any) => {
            result = useBooleanState(initialValue);
            return null;
        };
        render(<TestComponent initialValue={false} />);
        act(() => result[3]());
        expect(result[0]).toBe(true);
        act(() => result[3]());
        expect(result[0]).toBe(false);
    });
});
