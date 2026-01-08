import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { useClassnames } from '@lumx/react/utils';

import { CLASSNAME as TABLE_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TableRowProps extends GenericProps {
    /** Whether the component is clickable or not. */
    isClickable?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableRow';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = `${TABLE_CLASSNAME}__row`;

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TableRowProps> = {};

/**
 * TableRow component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableRow = forwardRef<TableRowProps, HTMLTableRowElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const { children, className, isClickable, isSelected, ...forwardedProps } = otherProps;
    const { element } = useClassnames(TABLE_CLASSNAME);

    return (
        <tr
            ref={ref}
            tabIndex={isClickable && !disabledStateProps.disabled ? 0 : -1}
            {...forwardedProps}
            className={element(
                'row',
                {
                    'is-clickable': Boolean(isClickable && !isAnyDisabled),
                    'is-disabled': isAnyDisabled,
                    'is-selected': Boolean(isSelected && !isAnyDisabled),
                },
                className,
            )}
            aria-disabled={isAnyDisabled}
        >
            {children}
        </tr>
    );
});

TableRow.displayName = COMPONENT_NAME;
TableRow.className = CLASSNAME;
TableRow.defaultProps = DEFAULT_PROPS;
