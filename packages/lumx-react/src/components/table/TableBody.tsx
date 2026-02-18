import {
    TableBody as UI,
    TableBodyProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Table/TableBody';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface TableBodyProps extends GenericProps, ReactToJSX<UIProps> {}

/**
 * TableBody component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableBody = forwardRef<TableBodyProps, HTMLTableSectionElement>((props, ref) => {
    const { children, ...otherProps } = props;

    return UI({
        ref,
        children,
        ...otherProps,
    });
});
TableBody.displayName = COMPONENT_NAME;
TableBody.className = CLASSNAME;
