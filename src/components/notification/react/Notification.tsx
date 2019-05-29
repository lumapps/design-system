import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Button, ButtonThemes, Icon, Sizes, Theme, Themes } from 'LumX';
import { Emphasises } from 'LumX/components/button/react/Button';
import { NOTIFICATION_CONFIGURATION } from 'LumX/components/notification/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Different types of notification.
 */
const enum NotificationTypes {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
}
type NotificationType = NotificationTypes;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface INotificationProps extends IGenericProps {
    /** Label for action button. */
    actionLabel?: string;

    /** Content of notification. */
    content?: React.ReactNode;

    /** Whether notification is open or not. */
    isOpen?: boolean;

    /** Theme */
    theme?: Theme;

    /** Type of notification (info, success, warning, error). */
    type?: NotificationType;

    /** Callback function for action button. */
    actionCallback?(): void;

    /** Function to handle click on the notification. */
    handleClick?(): void;
}
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
const DEFAULT_PROPS: IDefaultPropsType = {
    content: '',
    theme: Themes.light,
};
/////////////////////////////

/**
 * Notification.
 *
 * @return {React.ReactElement} The component.
 */
const Notification: React.FC<NotificationProps> = ({
    actionCallback,
    actionLabel,
    content = DEFAULT_PROPS.content,
    className = '',
    handleClick,
    isOpen = false,
    theme = DEFAULT_PROPS.theme,
    type,
    ...props
}: NotificationProps): React.ReactElement => {
    const hasAction: boolean = Boolean(actionCallback) && Boolean(actionLabel);

    const handleCallback: (evt: React.MouseEvent<HTMLElement>) => void = (evt: React.MouseEvent<HTMLElement>): void => {
        if (isFunction(actionCallback)) {
            actionCallback();
        }

        evt.stopPropagation();
    };

    return (
        <Fragment>
            {type &&
                createPortal(
                    <div
                        className={classNames(
                            className,
                            handleBasicClasses({
                                color: `${NOTIFICATION_CONFIGURATION[type].color}`,
                                hasAction,
                                isHidden: !isOpen,
                                prefix: CLASSNAME,
                            }),
                        )}
                        {...props}
                        onClick={handleClick}
                        style={{ zIndex: 9999 }}
                    >
                        <div className={`${CLASSNAME}__icon`}>
                            <Icon icon={NOTIFICATION_CONFIGURATION[type].icon} size={Sizes.s} />
                        </div>
                        <span className={`${CLASSNAME}__content`}>{content}</span>
                        {hasAction && (
                            <div className={`${CLASSNAME}__action`}>
                                <Button
                                    color={theme === ButtonThemes.dark ? 'light' : undefined}
                                    emphasis={Emphasises.medium}
                                    theme={theme}
                                    onClick={handleCallback}
                                >
                                    <span>{actionLabel}</span>
                                </Button>
                            </div>
                        )}
                    </div>,
                    document.body,
                )}
        </Fragment>
    );
};
Notification.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Notification,
    NotificationProps,
    NotificationType,
    NotificationTypes,
    Theme,
    Themes,
};
