/**
 * Clamp value in range.
 *
 * @param value Value to clamp.
 * @param min   Minimum value.
 * @param max   Maximum value.
 * @return Clamped value.
 */
export const clamp = (value: number, min: number, max: number): number => {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
};
