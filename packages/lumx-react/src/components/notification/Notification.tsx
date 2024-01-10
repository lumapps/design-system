import React, { forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Button, Emphasis, Icon, Kind, Size, Theme } from '@lumx/react';

import { DOCUMENT } from '@lumx/react/constants';
import { NOTIFICATION_CONFIGURATION } from '@lumx/react/components/notification/constants';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useNotificationStackContext } from '@lumx/react/components/notification/NotificationStackContext';

/**
 * Defines the props of the component.
 */
export interface NotificationProps extends GenericProps, HasTheme {
    /** Action button label. */
    actionLabel?: string;
    /** Content. */
    content?: React.ReactNode;
    /** Whether the component is open or not. */
    isOpen?: boolean;
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
    const { actionLabel, className, content, isOpen, onActionClick, theme, type, zIndex, ...forwardedProps } = props;
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    const { color, icon } = NOTIFICATION_CONFIGURATION[type as Kind] || {};
    const rootRef = useRef<HTMLDivElement>(null);
    const isVisible = useTransitionVisibility(rootRef, !!isOpen);
    const hasAction: boolean = Boolean(onActionClick) && Boolean(actionLabel);

    const handleCallback = (evt: React.MouseEvent) => {
        if (isFunction(onActionClick)) {
            onActionClick();
        }
        evt.stopPropagation();
    };

    const context = useNotificationStackContext();
    React.useEffect(() => {
        const { current } = rootRef;
        if (isVisible && current && context) {
            context.register(current);
            return () => context.unregister(current);
        }
        return undefined;
    }, [context, isVisible]);

    if (!isVisible || !type) return null;

    const notification = (
        <div
            ref={mergeRefs(ref, rootRef)}
            role="status"
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
        </div>
    );

    // Rendered in a notification stack
    if (context) return notification;

    // Not in a notification stack => render in portal
    return createPortal(notification, document.body);
});
Notification.displayName = COMPONENT_NAME;
Notification.className = CLASSNAME;
Notification.defaultProps = DEFAULT_PROPS;
