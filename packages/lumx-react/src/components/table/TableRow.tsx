import {
    TableRow as UI,
    TableRowProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Table/TableRow';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface TableRowProps extends GenericProps, ReactToJSX<UIProps, 'tabIndex' | 'aria-disabled'> {
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
}

/**
 * TableRow component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableRow = forwardRef<TableRowProps, HTMLTableRowElement>((props, ref) => {
    const { isAnyDisabled, otherProps } = useDisableStateProps(props);
    const { children, isClickable, 'aria-disabled': _ariaDisabled, ...forwardedProps } = otherProps;

    return UI({
        ref,
        children,
        isClickable,
        tabIndex: isClickable && !isAnyDisabled ? 0 : -1,
        'aria-disabled': isAnyDisabled,
        ...forwardedProps,
    });
});

TableRow.displayName = COMPONENT_NAME;
TableRow.className = CLASSNAME;
TableRow.defaultProps = DEFAULT_PROPS;
