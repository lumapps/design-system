import get from 'lodash/get';
import { Children, Key, ReactChild, ReactNode, cloneElement, isValidElement } from 'react';
import { isFragment } from 'react-is';

/**
 * Flatten list of react nodes removing fragments and adding keys.
 * based on: https://github.com/grrowl/react-keyed-flatten-children/blob/5d421644a449765ddd62b659946196b4b5d7b135/index.ts
 *
 * @param  children React nodes to flatten.
 * @return Flattened react nodes.
 * @deprecated This function was used to develop keyboard navigation in the List component,
 *    but we will replace this with a better method that does not require to hack the children inspection
 *
 * TODO: remove List keyboard navigation once we have provided alternative component (Menu, Combobox, etc.),
 *       remove this function and then remove react-is from the dependencies
 */
export function flattenChildren(children: ReactNode) {
    function recur(nodes: ReactNode, keys: Key[] = []) {
        return Children.toArray(nodes).reduce((acc: ReactChild[], node, index) => {
            const nodeKeys = keys.concat(get(node, 'key') ?? index);
            if (isFragment(node)) {
                acc.push(...recur(node.props.children, nodeKeys));
            } else if (isValidElement(node)) {
                acc.push(cloneElement(node, { key: nodeKeys.join('.') }));
            } else if (typeof node === 'string' || typeof node === 'number') {
                acc.push(node);
            }
            return acc;
        }, []);
    }
    return recur(children);
}
