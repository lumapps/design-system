import { forwardRef } from './forwardRef';

describe('forwardRef', () => {
    it('should behave like React.forwardRef', () => {
        const Comp = forwardRef((props, ref) => <div ref={ref as any} />);
        expect(Comp.$$typeof).toBe(Symbol.for('react.forward_ref'));
    });
});
