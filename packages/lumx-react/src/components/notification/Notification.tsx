import React from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Button, Emphasis, Icon, Size, Theme } from '@lumx/react';

import { NOTIFICATION_CONFIGURATION } from '@lumx/react/components/notification/constants';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Different types of notification.
 */
enum NotificationType {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
}

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
    type: NotificationType;

    /** The z-axis position. */
    zIndex?: number;

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
    zIndex: 9999,
};
/////////////////////////////

/**
 * Notification.
 *
 * @return The notification component.
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
    zIndex = DEFAULT_PROPS.zIndex,
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
        !!type &&
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
                style={{ zIndex }}
            >
                <div className={`${CLASSNAME}__icon`}>
                    <Icon icon={NOTIFICATION_CONFIGURATION[type].icon} size={Size.s} />
                </div>
                <div className={`${CLASSNAME}__content`}>{content}</div>
                {hasAction && (
                    <div className={`${CLASSNAME}__action`}>
                        <Button emphasis={Emphasis.medium} theme={theme} onClick={handleCallback}>
                            <span>{actionLabel}</span>
                        </Button>
                    </div>
                )}
            </div>,
            document.body,
        )
    );
};
Notification.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Notification, NotificationProps, NotificationType };
