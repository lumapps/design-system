import React from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Button, ButtonEmphasis, Icon, Size, Theme } from 'LumX';

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
interface INotificationBarProps extends IGenericProps {
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
type NotificationBarProps = INotificationBarProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<NotificationBarProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Notification`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    content: '',
    theme: Theme.light,
};
/////////////////////////////

/**
 * Notification.
 *
 * @return The notification component.
 */
const NotificationBar: React.FC<NotificationBarProps> = ({
    actionCallback,
    actionLabel,
    content = DEFAULT_PROPS.content,
    className = '',
    handleClick,
    isOpen = false,
    theme = DEFAULT_PROPS.theme,
    type,
    ...props
}: NotificationBarProps): React.ReactElement => {
    const hasAction: boolean = Boolean(actionCallback) && Boolean(actionLabel);

    const handleCallback: (evt: React.MouseEvent<HTMLElement>) => void = (evt: React.MouseEvent<HTMLElement>): void => {
        if (isFunction(actionCallback)) {
            actionCallback();
        }

        evt.stopPropagation();
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
                            <Icon icon={NOTIFICATION_CONFIGURATION[type].icon} size={Size.s} />
                        </div>
                        <div className={`${CLASSNAME}__content`}>{content}</div>
                        {hasAction && (
                            <div className={`${CLASSNAME}__action`}>
                                <Button
                                    color={theme === Theme.dark ? 'light' : undefined}
                                    emphasis={ButtonEmphasis.medium}
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
NotificationBar.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, NotificationBar, NotificationBarProps, NotificationType };
