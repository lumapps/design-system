import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IListDividerProps extends IGenericProps {}
type ListDividerProps = IListDividerProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ListDividerProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}ListDivider`;

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

/**
 * Renders a thin line that will acts as a divider in List
 *
 * @return {React.ReactElement} The component.
 */
const ListDivider: React.FC<ListDividerProps> = ({
    className = '',
    ...props
}: ListDividerProps): React.ReactElement => {
    return <li className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props} />;
};
ListDivider.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ListDivider, ListDividerProps };
