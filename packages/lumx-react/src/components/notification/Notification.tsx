import React from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Button, Emphasis, Icon, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, DOCUMENT, NOTIFICATION_TRANSITION_DURATION } from '@lumx/react/constants';
import { NOTIFICATION_CONFIGURATION } from '@lumx/react/components/notification/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';

/**
 * Different types of notification.
 */
export enum NotificationType {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
}

/**
 * Defines the props of the component.
 */
export interface NotificationProps extends GenericProps {
    /** The label of the action button. */
    actionLabel?: string;
    /** The content of the notification. */
    content?: React.ReactNode;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The type of notification (error or success for example). */
    type?: NotificationType;
    /** The z-axis position. */
    zIndex?: number;
    /** The function called on click on the action button. */
    onActionClick?(): void;
    /** The function called on click on the component. */
    onClick?(): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Notification`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
export const Notification: React.FC<NotificationProps> = ({
    actionLabel,
    className,
    content,
    isOpen,
    onActionClick,
    onClick,
    theme,
    type,
    zIndex,
    ...forwardedProps
}) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    const hasAction: boolean = Boolean(onActionClick) && Boolean(actionLabel);

    const isVisible = useDelayedVisibility(!!isOpen, NOTIFICATION_TRANSITION_DURATION);

    const handleCallback = (evt: React.MouseEvent) => {
        if (isFunction(onActionClick)) {
            onActionClick();
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
                  onClick={onClick}
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
