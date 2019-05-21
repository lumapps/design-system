import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Theme, Themes } from 'LumX';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface INotificationProps extends IGenericProps {}
type NotificationProps = INotificationProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<NotificationProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Notification`;

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
 * [Enter the description of the component here].
 *
 * @return {React.ReactElement} The component.
 */
const Notification: React.FC<NotificationProps> = ({
    children,
    className = '',
    ...props
}: NotificationProps): React.ReactElement => {
    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {children}
        </div>
    );
};
Notification.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Notification, NotificationProps, Theme, Themes };
