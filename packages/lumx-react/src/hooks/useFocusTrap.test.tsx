import { render } from '@testing-library/react';
import { vi } from 'vitest';
import * as setupFocusTrapModule from '@lumx/core/js/utils/focus/setupFocusTrap';
import { useFocusTrap } from './useFocusTrap';

vi.mock('@lumx/core/js/utils/focus/setupFocusTrap', () => ({
    setupFocusTrap: vi.fn(),
}));

const TestComponent = ({ zone, focusElement }: any) => {
    useFocusTrap(zone, focusElement);
    return null;
};

describe('useFocusTrap', () => {
    beforeEach(() => {
        (setupFocusTrapModule.setupFocusTrap as any).mockClear();
    });

    it('should call setupFocusTrap with the zone and abort signal', () => {
        const zone = document.createElement('div');
        render(<TestComponent zone={zone} />);

        expect(setupFocusTrapModule.setupFocusTrap).toHaveBeenCalledWith(
            { focusZoneElement: zone, focusElement: undefined },
            expect.any(AbortSignal),
        );
    });

    it('should pass focusElement through to setupFocusTrap', () => {
        const zone = document.createElement('div');
        const focusElement = document.createElement('button');
        render(<TestComponent zone={zone} focusElement={focusElement} />);

        expect(setupFocusTrapModule.setupFocusTrap).toHaveBeenCalledWith(
            { focusZoneElement: zone, focusElement },
            expect.any(AbortSignal),
        );
    });

    it('should not call setupFocusTrap when zone is falsy', () => {
        render(<TestComponent zone={null} />);
        expect(setupFocusTrapModule.setupFocusTrap).not.toHaveBeenCalled();
    });

    it('should abort the signal on unmount', () => {
        const zone = document.createElement('div');
        const { unmount } = render(<TestComponent zone={zone} />);

        const signal = (setupFocusTrapModule.setupFocusTrap as any).mock.calls[0][1] as AbortSignal;
        expect(signal.aborted).toBe(false);

        unmount();
        expect(signal.aborted).toBe(true);
    });
});
