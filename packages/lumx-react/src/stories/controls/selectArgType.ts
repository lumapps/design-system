import isPlainObject from 'lodash/isPlainObject';

export const getSelectArgType = <E>(options: Array<E> | Record<string, E>) => ({
    control: { type: 'select' },
    options: Object.values(options),
    mapping: isPlainObject(options) ? options : undefined,
});
