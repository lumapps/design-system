import {
    TableBody as TableBodyUI,
    TableBodyProps as TableBodyUIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Table/TableBody';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface TableBodyProps extends GenericProps, Omit<TableBodyUIProps, 'ref'> {
    /** Children */
    children?: React.ReactNode;
}

/**
 * TableBody component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableBody = forwardRef<TableBodyProps, HTMLTableSectionElement>((props, ref) => {
    const { children, ...otherProps } = props;

    return TableBodyUI({
        ref,
        children,
        ...otherProps,
    });
});
TableBody.displayName = COMPONENT_NAME;
TableBody.className = CLASSNAME;
