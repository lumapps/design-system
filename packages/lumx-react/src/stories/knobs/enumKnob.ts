import isArray from 'lodash/isArray';
import { select } from '@storybook/addon-knobs';

export function enumKnob<T>(
    name: string,
    enumObj: Readonly<Record<string, T> | Array<T> | [...T[]]>,
    defaultValue?: T,
    groupId?: string,
): T {
    const values: Record<string, T> = !isArray(enumObj)
        ? enumObj
        : Object.fromEntries(Object.values(enumObj).map((value) => [value, value]));
    return select<any>(name, values, defaultValue, groupId);
}
