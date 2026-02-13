import { Theme } from '@lumx/react';
import {
    Table as TableUI,
    TableProps as TableUIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Table';
import { GenericProps } from '@lumx/react/utils/type';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface TableProps extends GenericProps, Omit<TableUIProps, 'ref'> {
    /** Children */
    children?: React.ReactNode;
}

/**
 * Table component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Table = forwardRef<TableProps, HTMLTableElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { children, theme = defaultTheme, ...otherProps } = props;

    return TableUI({
        ref,
        theme,
        children,
        ...otherProps,
    });
});
Table.displayName = COMPONENT_NAME;
Table.className = CLASSNAME;
Table.defaultProps = DEFAULT_PROPS;
