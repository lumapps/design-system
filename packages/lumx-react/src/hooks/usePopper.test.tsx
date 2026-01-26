import { render } from '@testing-library/react';
import { IS_BROWSER } from '@lumx/react/constants';
import { usePopper } from './usePopper';

describe('usePopper', () => {
    it('should return popper attributes and styles', () => {
        const anchorEl = document.createElement('div');
        const popperEl = document.createElement('div');

        let result: any;
        const TestComponent = ({ anchor, popper, opts }: any) => {
            result = usePopper(anchor, popper, opts);
            return null;
        };
        render(<TestComponent anchor={anchorEl} popper={popperEl} opts={{ placement: 'bottom' }} />);

        expect(result.attributes.popper).toBeDefined();
        expect(result.styles.popper).toBeDefined();

        if (!IS_BROWSER) {
            expect(result.attributes.popper?.['data-popper-placement']).toBe('bottom');
        }
    });
});
