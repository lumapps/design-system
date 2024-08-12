import { castArray } from '@lumx/core/js/utils/collection/castArray';
import { concatPath } from './concatPath';

type Props = Record<string, any>;
type OneOrMoreProps = Props | Array<Props>;

/**
 * Build a flat props object from the given nested props
 *
 * @example toFlattenProps({ foo: { bar: 4 } }) // => { 'foo.bar': 4 }
 * @example toFlattenProps({ foo: [{ bar: 4 }, { bar: 5 }] }) // => { 'foo[0].bar': 4, 'foo[0].bar': 5 }
 */
export function toFlattenProps(props: { [prefix: string]: OneOrMoreProps }): Props {
    const out: Props = {};
    for (const [prefix, oneOrMoreProps] of Object.entries(props)) {
        const propsArray = castArray(oneOrMoreProps);

        for (let i = 0; i < propsArray.length; i += 1) {
            const path = Array.isArray(oneOrMoreProps) ? concatPath(prefix, i) : prefix;
            const subProps = propsArray[i];

            for (const [key, value] of Object.entries(subProps)) {
                out[concatPath(path, key)] = value;
            }
        }
    }
    return out;
}
