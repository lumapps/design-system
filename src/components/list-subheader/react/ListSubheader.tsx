import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

import { handleBasicClasses } from 'LumX/core/utils';

import { Theme, Themes } from 'LumX/components';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IListSubheaderProps extends IGenericProps {}
type ListSubheaderProps = IListSubheaderProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ListSubheaderProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}ListSubheader`;

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
 * Component used in List to display some separator / title section.
 *
 * @return {React.ReactElement} The component.
 */
const ListSubheader: React.FC<ListSubheaderProps> = ({
    children,
    className = '',
    ...props
}: ListSubheaderProps): React.ReactElement => {
    return (
        <li className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {children}
        </li>
    );
};
ListSubheader.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ListSubheader, ListSubheaderProps, Theme, Themes };
