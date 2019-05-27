import React from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

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
    actionLabel?: string;
    content: React.ReactNode;
    isOpen?: boolean;
    theme?: Theme;
    type?: NotificationType;
    actionCallback?(): void;
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
    content,
    className = '',
    handleClick,
    isOpen = false,
    theme = DEFAULT_PROPS.theme,
    type,
    ...props
}: NotificationProps): React.ReactElement => {
    const hasAction: boolean = Boolean(actionCallback) && Boolean(actionLabel);

    const handleCallback: (event: React.MouseEvent<HTMLElement>) => void = (
        event: React.MouseEvent<HTMLElement>,
    ): void => {
        if (actionCallback) {
            actionCallback();
        }

        event.stopPropagation();
    };

    return (
        <>
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
        </>
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
