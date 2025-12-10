import { GenericProps } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { CLASSNAME as TABLE_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TableHeaderProps extends GenericProps {
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableHeader';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = `${TABLE_CLASSNAME}__header`;

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TableHeaderProps> = {};

/**
 * TableHeader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableHeader = forwardRef<TableHeaderProps, HTMLTableSectionElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <thead ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </thead>
    );
});
TableHeader.displayName = COMPONENT_NAME;
TableHeader.className = CLASSNAME;
TableHeader.defaultProps = DEFAULT_PROPS;
