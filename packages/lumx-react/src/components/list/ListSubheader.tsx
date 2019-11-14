import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { IGenericProps, getRootClassName } from '@lumx/react/utils';

import { handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IListSubheaderProps extends IGenericProps {
    /** List sub header content. */
    children: string | ReactNode;
}
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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListSubheader`;

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
 * Component used in List to display some separator / title section.
 *
 * @return The component.
 */
const ListSubheader: React.FC<ListSubheaderProps> = ({
    children,
    className = '',
    ...props
}: ListSubheaderProps): ReactElement => {
    return (
        <li className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {children}
        </li>
    );
};
ListSubheader.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ListSubheader, ListSubheaderProps };
