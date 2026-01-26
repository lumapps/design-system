import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useIntersectionObserver } from './useIntersectionObserver';

const TestComponent = ({ elements }: any) => {
    useIntersectionObserver(elements);
    return null;
};

describe('useIntersectionObserver', () => {
    it('should observe elements', () => {
        const observe = vi.fn();
        const disconnect = vi.fn();

        // Mock IntersectionObserver
        const MockObserver = vi.fn(() => ({
            observe,
            disconnect,
            unobserve: vi.fn(),
        }));
        vi.stubGlobal('IntersectionObserver', MockObserver);

        const element = document.createElement('div');
        render(<TestComponent elements={[element]} />);

        expect(MockObserver).toHaveBeenCalled();
        expect(observe).toHaveBeenCalledWith(element);
    });
});
