import {
    TableHeader as UI,
    TableHeaderProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Table/TableHeader';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface TableHeaderProps extends GenericProps, ReactToJSX<UIProps, 'ref'> {}

/**
 * TableHeader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableHeader = forwardRef<TableHeaderProps, HTMLTableSectionElement>((props, ref) => {
    const { children, ...otherProps } = props;

    return UI({
        ref,
        children,
        ...otherProps,
    });
});
TableHeader.displayName = COMPONENT_NAME;
TableHeader.className = CLASSNAME;
TableHeader.defaultProps = DEFAULT_PROPS;
