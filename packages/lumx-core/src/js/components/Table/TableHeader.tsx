import type { JSXElement, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

import { CLASSNAME as TABLE_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TableHeaderProps extends HasClassName {
    /** Children */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TableHeader';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = `${TABLE_CLASSNAME}__header`;

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TableHeaderProps> = {};

/**
 * TableHeader component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const TableHeader = (props: TableHeaderProps) => {
    const { children, className, ref, ...forwardedProps } = props;

    return (
        <thead ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </thead>
    );
};
