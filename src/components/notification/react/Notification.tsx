import React from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Button, ButtonThemes, Icon, Sizes, Theme, Themes } from 'LumX';
import { Emphasises } from 'LumX/components/button/react/Button';
import { NOTIFICATION_CONFIGURATION } from 'LumX/components/notification/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { NotificationType, NotificationTypes } from './types';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface INotificationProps extends IGenericProps {
    actionLabel?: string;
    content: React.ReactNode;
    theme?: Theme;
    type?: NotificationType;
    actionCallback?(): void;
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
    type: NotificationTypes.info,
};
/////////////////////////////

/**
 * Notification
 *
 * @return {React.ReactElement} The component.
 */
const Notification: React.FC<NotificationProps> = ({
    actionCallback,
    actionLabel,
    content,
    className = '',
    theme = DEFAULT_PROPS.theme,
    type = DEFAULT_PROPS.type,
    ...props
}: NotificationProps): React.ReactElement => {
    const hasAction: boolean = Boolean(actionCallback) && Boolean(actionLabel);

    return (
        <>
            {createPortal(
                <div
                    className={classNames(
                        className,
                        handleBasicClasses({
                            color: `${NOTIFICATION_CONFIGURATION[type!].color}`,
                            hasAction,
                            prefix: CLASSNAME,
                        }),
                    )}
                    {...props}
                    style={{ zIndex: 9999 }}
                >
                    <div className={`${CLASSNAME}__icon`}>
                        <Icon icon={NOTIFICATION_CONFIGURATION[type!].icon} size={Sizes.s} />
                    </div>
                    <span className={`${CLASSNAME}__content`}>{content}</span>
                    {hasAction && (
                        <div className={`${CLASSNAME}__action`}>
                            <Button
                                color={theme === ButtonThemes.dark ? 'light' : undefined}
                                emphasis={Emphasises.medium}
                                theme={theme}
                                onClick={actionCallback}
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

export { CLASSNAME, DEFAULT_PROPS, Notification, NotificationProps, NotificationType, Theme, Themes };
