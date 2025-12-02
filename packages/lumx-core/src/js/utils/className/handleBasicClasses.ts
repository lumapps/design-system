import classNames from 'classnames';

import { isEmpty } from '@lumx/core/js/utils/collection/isEmpty';

import { getBasicClass } from './getBasicClass';

/**
 * Enhance isEmpty method to also works with numbers.
 *
 * @param  value The value to check.
 * @return Whether the input value is empty or != 0.
 */
const _isEmpty = (value: any) => {
    if (typeof value === 'number') {
        return value === 0;
    }

    return isEmpty(value);
};

/**
 * Return all basic LumX CSS classes which are available for every components.
 *
 * @see {@link /src/components/index.d.ts} for the possible values of each parameter.
 *
 * @param  prefix The class name prefix for the generated CSS class.
 * @param  props  All the other props you want to generate a class.
 *                The rule of thumb: the key is the name of the prop in the class, the value a string that will
 *                be used in the classname to represent the value of the given prop.
 * @return All LumX basic CSS classes.
 */
export function handleBasicClasses({ prefix, ...props }: { prefix: string; [prop: string]: any }): string {
    const otherClasses: any = {};
    if (!isEmpty(props)) {
        Object.keys(props).forEach((prop) => {
            otherClasses[getBasicClass({ prefix, type: prop, value: props[prop] })] =
                typeof props[prop] === 'boolean' ? props[prop] : !_isEmpty(props[prop]);
        });
    }

    return classNames(prefix, otherClasses);
}
