import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableRowProps extends IGenericProps {
    /**
     * Whether the table row is clickable.
     */
    isClickable?: boolean;
    /**
     * Whether the table row is disabled.
     */
    isDisabled?: boolean;
    /**
     * Whether the table row is selected.
     */
    isSelected?: boolean;
}
type TableRowProps = ITableRowProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TableRowProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableRow`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    isClickable: false,
    isDisabled: false,
    isSelected: false,
};

/////////////////////////////

/**
 * The TableRow component displays an HTML Table Row, which contains table cells.
 *
 * @return The component.
 */
const TableRow: React.FC<TableRowProps> = ({
    children,
    className = '',
    isClickable = DEFAULT_PROPS.isClickable,
    isDisabled = DEFAULT_PROPS.isDisabled,
    isSelected = DEFAULT_PROPS.isSelected,
    ...props
}: TableRowProps): ReactElement => (
    <tr
        className={classNames(
            className,
            handleBasicClasses({
                isClickable: isClickable && !isDisabled,
                isDisabled,
                isSelected: isSelected && !isDisabled,
                prefix: CLASSNAME,
            }),
        )}
        tabIndex={isClickable && !isDisabled ? 0 : -1}
        {...props}
    >
        {children}
    </tr>
);

/////////////////////////////

TableRow.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TableRow, TableRowProps };
