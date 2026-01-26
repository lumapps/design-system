import { render } from '@testing-library/react';
import { vi } from 'vitest';
import * as bodyScrollLock from 'body-scroll-lock';
import { useDisableBodyScroll } from './useDisableBodyScroll';

vi.mock('body-scroll-lock', () => ({
    disableBodyScroll: vi.fn(),
    enableBodyScroll: vi.fn(),
}));

describe('useDisableBodyScroll', () => {
    it('should disable scroll when element is provided', () => {
        const el = document.createElement('div');
        const TestComponent = ({ element }: any) => {
            useDisableBodyScroll(element);
            return null;
        };
        render(<TestComponent element={el} />);

        expect(bodyScrollLock.disableBodyScroll).toHaveBeenCalledWith(el);
    });

    it('should enable scroll when unmounted', () => {
        const el = document.createElement('div');
        const TestComponent = ({ element }: any) => {
            useDisableBodyScroll(element);
            return null;
        };
        const { unmount } = render(<TestComponent element={el} />);

        unmount();
        expect(bodyScrollLock.enableBodyScroll).toHaveBeenCalledWith(el);
    });
});
