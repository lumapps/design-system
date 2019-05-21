import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableHeaderProps extends IGenericProps {}
type TableHeaderProps = ITableHeaderProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TableHeaderProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}TableHeader`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {TableHeaderProps}  props The children and props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: TableHeaderProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        props,
    });
}

/////////////////////////////

/**
 * The TableHeader component displays an HTML Table Head, composed TableHeader-cells in TableHeader Rows.
 *
 * @return {React.ReactElement} The component.
 */
const TableHeader: React.FC<TableHeaderProps> = ({
    children,
    className = '',
    ...props
}: TableHeaderProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, ...props });

    return (
        <thead className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {newChildren}
        </thead>
    );
};
TableHeader.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TableHeader, TableHeaderProps };
