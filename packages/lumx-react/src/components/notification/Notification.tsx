import React, { forwardRef } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Button, Emphasis, Icon, Kind, Size, Theme } from '@lumx/react';

import { DOCUMENT, NOTIFICATION_TRANSITION_DURATION } from '@lumx/react/constants';
import { NOTIFICATION_CONFIGURATION } from '@lumx/react/components/notification/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';

/**
 * Defines the props of the component.
 */
export interface NotificationProps extends GenericProps {
    /** Action button label. */
    actionLabel?: string;
    /** Content. */
    content?: React.ReactNode;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Notification type. */
    type?: Kind;
    /** Z-axis position. */
    zIndex?: number;
    /** On action button click callback. */
    onActionClick?(): void;
    /** On click callback. */
    onClick?(): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Notification';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<NotificationProps> = {
    theme: Theme.light,
    zIndex: 9999,
};

/* eslint-disable react-hooks/rules-of-hooks, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/**
 * Notification component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Notification: Comp<NotificationProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
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
    } = props;
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    const { color, icon } = NOTIFICATION_CONFIGURATION[type as Kind] || {};
    const isVisible = useDelayedVisibility(!!isOpen, NOTIFICATION_TRANSITION_DURATION);
    const hasAction: boolean = Boolean(onActionClick) && Boolean(actionLabel);

    const handleCallback = (evt: React.MouseEvent) => {
        if (isFunction(onActionClick)) {
            onActionClick();
        }
        evt.stopPropagation();
    };

    return type && isVisible
        ? createPortal(
              <div
                  ref={ref}
                  role="alert"
                  {...forwardedProps}
                  className={classNames(
                      className,
                      handleBasicClasses({
                          color,
                          hasAction,
                          isHidden: !isOpen,
                          prefix: CLASSNAME,
                      }),
                  )}
                  onClick={onClick}
                  style={{ zIndex }}
              >
                  <div className={`${CLASSNAME}__icon`}>
                      <Icon icon={icon} size={Size.s} />
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
});
Notification.displayName = COMPONENT_NAME;
Notification.className = CLASSNAME;
Notification.defaultProps = DEFAULT_PROPS;
