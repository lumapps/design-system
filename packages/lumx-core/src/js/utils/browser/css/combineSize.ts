/** Create a CSS min()/max() combiner function. */
function combineSize(combinator: 'min' | 'max') {
    return (size1?: string, size2?: string) => {
        if (size1 && size2) return `${combinator}(${size1}, ${size2})`;
        return size1 || size2 || '';
    };
}

/** Combine two CSS values with `min()`. */
export const cssMin = combineSize('min');

/** Combine two CSS values with `max()`. */
export const cssMax = combineSize('max');
