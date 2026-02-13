import type { JSXElement, HasTheme, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

import { CLASSNAME, COMPONENT_NAME } from './constants';

const { block } = classNames.bem(CLASSNAME);

/**
 * Defines the props of the component.
 */
export interface TableProps extends HasTheme, HasClassName {
    /** Whether the table has checkbox or thumbnail on first cell or not. */
    hasBefore?: boolean;
    /** Whether the table has dividers or not. */
    hasDividers?: boolean;
    /** Children */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TableProps> = {};

/**
 * Table component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const Table = (props: TableProps) => {
    const { children, className, hasBefore, hasDividers, ref, theme, ...forwardedProps } = props;

    return (
        <table
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    'has-before': hasBefore,
                    'has-dividers': hasDividers,
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            {children}
        </table>
    );
};

export { CLASSNAME, COMPONENT_NAME };
