import type { JSXElement, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

import { CLASSNAME as TABLE_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TableBodyProps extends HasClassName {
    /** Children */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TableBody';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = `${TABLE_CLASSNAME}__body`;

/**
 * TableBody component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const TableBody = (props: TableBodyProps) => {
    const { children, className, ref, ...forwardedProps } = props;

    return (
        <tbody ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </tbody>
    );
};
