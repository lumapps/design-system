import { Falsy } from '@lumx/react/utils/type';
import { MutableRefObject } from 'react';

type FnRef<T> = (value: T) => void;

/**
 * Merge refs into a single function ref.
 *
 * @param  refs React references to merge.
 * @return the merged ref.
 */
export function mergeRefs<T>(...refs: Array<MutableRefObject<T> | FnRef<T> | Falsy>): FnRef<T> {
    return (value) =>
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref) {
                ref.current = value;
            }
        });
}
