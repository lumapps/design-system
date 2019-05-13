import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Theme, Themes } from 'LumX/components';

/**
 *  Authorized size values.
 */
const enum Sizes {
    tiny = 'tiny',
    regular = 'regular',
    big = 'big',
    huge = 'huge',
}
type Size = Sizes;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IListItemProps extends IGenericProps {
    /* Whether the list item is selected or not */
    isselected?: boolean;
    /* Whether the list item can be clicked */
    isClickable?: boolean;
    /* Component size*/
    size?: Size;
    /* before element */
    before?: ReactElement;
    /* after element */
    after?: ReactElement;
}
type ListItemProps = IListItemProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ListItemProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}ListItem`;

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
const DEFAULT_PROPS: IDefaultPropsType = {
    isClickable: false,
    isselected: false,
    size: Sizes.regular,
};
/////////////////////////////

/**
 * Component used in List element.
 *
 * @return {React.ReactElement} The component.
 */
const ListItem: React.FC<ListItemProps> = ({
    after,
    children,
    className = '',
    isselected = DEFAULT_PROPS.isselected,
    isClickable = DEFAULT_PROPS.isselected,
    size = DEFAULT_PROPS.size,
    before,
    ...props
}: ListItemProps): React.ReactElement => {
    return (
        <li
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, selected: isselected, clickable: isClickable, size }),
            )}
            {...props}
        >
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            <div className={classNames(`${CLASSNAME}__content`)}>{children}</div>
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </li>
    );
};
ListItem.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ListItem, ListItemProps, Sizes, Theme, Themes };
