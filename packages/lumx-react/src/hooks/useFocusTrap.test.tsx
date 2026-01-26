import { render } from '@testing-library/react';
import { vi } from 'vitest';
import * as focusUtils from '@lumx/react/utils/browser/focus/getFirstAndLastFocusable';
import { useFocusTrap } from './useFocusTrap';

vi.mock('@lumx/react/utils/browser/focus/getFirstAndLastFocusable', () => ({
    getFirstAndLastFocusable: vi.fn(),
}));

const TestComponent = ({ zone, focusElement }: any) => {
    useFocusTrap(zone, focusElement);
    return null;
};

describe('useFocusTrap', () => {
    it('should focus the first focusable element when activated', () => {
        const zone = document.createElement('div');
        const first = document.createElement('button');
        const last = document.createElement('button');
        const focusSpy = vi.spyOn(first, 'focus');

        (focusUtils.getFirstAndLastFocusable as any).mockReturnValue({ first, last });

        render(<TestComponent zone={zone} />);
        expect(focusSpy).toHaveBeenCalled();
    });

    it('should focus the specified focusElement', () => {
        const zone = document.createElement('div');
        const first = document.createElement('button');
        const specified = document.createElement('button');
        zone.appendChild(specified);
        const focusSpy = vi.spyOn(specified, 'focus');

        (focusUtils.getFirstAndLastFocusable as any).mockReturnValue({ first });

        render(<TestComponent zone={zone} focusElement={specified} />);
        expect(focusSpy).toHaveBeenCalled();
    });
});
