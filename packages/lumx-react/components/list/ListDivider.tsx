import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/core/react/constants';

import { IGenericProps, getRootClassName } from '@lumx/core/react/utils';
import { handleBasicClasses } from '@lumx/core/utils';

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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListDivider`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {};
/////////////////////////////

/**
 * Renders a thin line that will acts as a divider in List
 *
 * @return The component.
 */
const ListDivider: React.FC<ListDividerProps> = ({ className = '', ...props }: ListDividerProps): ReactElement => {
    return <li className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props} />;
};
ListDivider.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ListDivider, ListDividerProps };
