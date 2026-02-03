type FunctionSelector<TObject, TValue> = (o: TObject) => TValue;

// Only keep fields of `TObject` that have a `TValue` value
type FieldSelector<TObject, TValue> = keyof {
    [TKey in keyof TObject as TObject[TKey] extends TValue ? TKey : never]: TObject[TKey];
};

/**
 * Value selector on an object
 * - either via an object key
 * - or a selector function
 */
export type Selector<TObject, TValue = string> = FieldSelector<TObject, TValue> | FunctionSelector<TObject, TValue>;
