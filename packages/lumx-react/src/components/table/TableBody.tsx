import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

import { CLASSNAME as TABLE_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TableBodyProps extends GenericProps {
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableBody';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = `${TABLE_CLASSNAME}__body`;

/**
 * TableBody component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableBody = forwardRef<TableBodyProps, HTMLTableSectionElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;
    const { block } = useClassnames(CLASSNAME);

    return (
        <tbody ref={ref} {...forwardedProps} className={block([className])}>
            {children}
        </tbody>
    );
});
TableBody.displayName = COMPONENT_NAME;
TableBody.className = CLASSNAME;
