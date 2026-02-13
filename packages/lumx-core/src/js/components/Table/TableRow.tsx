import type { JSXElement, HasClassName, CommonRef, HasAriaDisabled } from '../../types';
import { classNames } from '../../utils';

import { CLASSNAME as TABLE_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TableRowProps extends HasClassName, HasAriaDisabled {
    /** Whether the component is clickable or not. */
    isClickable?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Tab index */
    tabIndex?: number;
    /** Children */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TableRow';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = `${TABLE_CLASSNAME}__row`;
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TableRowProps> = {};

/**
 * TableRow component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const TableRow = (props: TableRowProps) => {
    const {
        children,
        className,
        isClickable,
        isSelected,
        ref,
        tabIndex,
        'aria-disabled': ariaDisabled,
        ...forwardedProps
    } = props;
    const isDisabled = Boolean(ariaDisabled);

    // Use object spread for tabIndex to ensure cross-framework compatibility (Vue JSX expects lowercase 'tabindex')
    const tabIndexProps = tabIndex !== undefined ? { tabIndex } : {};

    return (
        <tr
            ref={ref}
            aria-disabled={ariaDisabled}
            {...tabIndexProps}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    'is-clickable': isClickable && !isDisabled,
                    'is-disabled': isDisabled,
                    'is-selected': isSelected && !isDisabled,
                }),
            )}
        >
            {children}
        </tr>
    );
};
