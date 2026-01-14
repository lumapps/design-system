import { GenericProps } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

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
const { block } = classNames.bem(CLASSNAME);

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

    return (
        <tr
            ref={ref}
            tabIndex={isClickable && !disabledStateProps.disabled ? 0 : -1}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    'is-clickable': isClickable && !isAnyDisabled,
                    'is-disabled': isAnyDisabled,
                    'is-selected': isSelected && !isAnyDisabled,
                }),
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
