import { Selector } from '../../types';

/** Get value with a string of function selector */
export const getWithSelector = <TObject, TValue>(
    selector: Selector<TObject, TValue> | undefined,
    object: TObject,
): TValue => {
    // Use the provided selector function
    if (typeof selector === 'function') {
        return selector(object);
    }
    // Use the provided selector as a property name
    if (typeof selector === 'string') {
        return object[selector] as TValue;
    }
    return String(object) as TValue;
};
