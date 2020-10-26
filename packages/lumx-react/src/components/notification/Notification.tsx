import React from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Button, Emphasis, Icon, Size, Theme } from '@lumx/react';

import { NOTIFICATION_TRANSITION_DURATION } from '@lumx/react/constants';

import { NOTIFICATION_CONFIGURATION } from '@lumx/react/components/notification/constants';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';

/**
 * Different types of notification.
 */
enum NotificationType {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
}

/**
 * Defines the props of the component.
 */
interface NotificationProps extends GenericProps {
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

    /** The z-axis position. */
    zIndex?: number;

    /** Callback function for action button. */
    actionCallback?(): void;

    /** Function to handle click on the notification. */
    handleClick?(): void;
}

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
const DEFAULT_PROPS: Partial<NotificationProps> = {
    theme: Theme.light,
    zIndex: 9999,
};

/**
 * Notification.
 *
 * @return The notification component.
 */
const Notification: React.FC<NotificationProps> = ({
    actionCallback,
    actionLabel,
    content,
    className,
    handleClick,
    isOpen,
    theme,
    type,
    zIndex,
    ...forwardedProps
}) => {
    const hasAction: boolean = Boolean(actionCallback) && Boolean(actionLabel);

    const isVisible = useDelayedVisibility(!!isOpen, NOTIFICATION_TRANSITION_DURATION);

    const handleCallback = (evt: React.MouseEvent) => {
        if (isFunction(actionCallback)) {
            actionCallback();
        }
        evt.stopPropagation();
    };

    return type && isVisible
        ? createPortal(
              <div
                  {...forwardedProps}
                  className={classNames(
                      className,
                      handleBasicClasses({
                          color: `${NOTIFICATION_CONFIGURATION[type].color}`,
                          hasAction,
                          isHidden: !isOpen,
                          prefix: CLASSNAME,
                      }),
                  )}
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
        : null;
};
Notification.displayName = COMPONENT_NAME;
Notification.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Notification, NotificationProps, NotificationType };
