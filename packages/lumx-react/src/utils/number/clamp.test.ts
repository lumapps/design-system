import { clamp } from './clamp';

describe('clamp', () => {
    it('should clamp value to min', () => {
        expect(clamp(5, 10, 20)).toBe(10);
    });

    it('should clamp value to max', () => {
        expect(clamp(25, 10, 20)).toBe(20);
    });

    it('should not clamp value if in range', () => {
        expect(clamp(15, 10, 20)).toBe(15);
    });
});
