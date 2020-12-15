import isArray from 'lodash/isArray';
import { select } from '@storybook/addon-knobs';

export function selectEnum<T, D>(
    name: string,
    enumObj: Record<string, T> | Array<T>,
    defaultValue: D,
    groupId?: string,
): T | D {
    const values: Record<string, T | D> = !isArray(enumObj)
        ? enumObj
        : Object.fromEntries(Object.values(enumObj).map((value) => [value, value]));
    if (!Object.values(values).find((v) => defaultValue)) {
        (values as any)[defaultValue] = defaultValue;
    }
    return select<any>(name, values, defaultValue, groupId);
}
