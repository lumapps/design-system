import isPlainObject from 'lodash/isPlainObject';

export const getSelectArgType = <E>(
    options: Array<E> | Record<string, E>,
    type: 'select' | 'inline-radio' = 'inline-radio',
) => ({
    control: { type },
    options: Object.values(options),
    mapping: isPlainObject(options) ? options : undefined,
});
