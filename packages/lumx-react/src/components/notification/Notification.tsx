import { useRef } from 'react';

import classNames from 'classnames';
import isFunction from 'lodash/isFunction';

import { Button, Emphasis, Icon, Kind, Size, Theme } from '@lumx/react';
import { DOCUMENT, NOTIFICATION_TRANSITION_DURATION } from '@lumx/react/constants';
import { NOTIFICATION_CONFIGURATION } from '@lumx/react/components/notification/constants';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { Portal } from '@lumx/react/utils';

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
    /** Whether the notification should be rendered into a DOM node that exists outside the DOM hierarchy of the parent component. */
    usePortal?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Notification';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-notification';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<NotificationProps> = {
    zIndex: 9999,
    usePortal: true,
};

/* eslint-disable react-hooks/rules-of-hooks, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/**
 * Notification component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Notification = forwardRef<NotificationProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        actionLabel,
        className,
        content,
        isOpen,
        onActionClick,
        onClick,
        theme = defaultTheme,
        type,
        zIndex = DEFAULT_PROPS.zIndex,
        usePortal = DEFAULT_PROPS.usePortal,
        style,
        ...forwardedProps
    } = props;
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    const { color, icon } = NOTIFICATION_CONFIGURATION[type as Kind] || {};
    const rootRef = useRef<HTMLDivElement>(null);
    const isVisible = useTransitionVisibility(rootRef, !!isOpen, NOTIFICATION_TRANSITION_DURATION);
    const hasAction: boolean = Boolean(onActionClick) && Boolean(actionLabel);

    const handleCallback = (evt: React.MouseEvent) => {
        if (isFunction(onActionClick)) {
            onActionClick();
        }
        evt.stopPropagation();
    };

    if (!type || !isVisible) {
        return null;
    }

    return (
        <Portal enabled={usePortal}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <div
                ref={mergeRefs(ref, rootRef)}
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
                style={{ ...style, zIndex }}
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
        </Portal>
    );
});
Notification.displayName = COMPONENT_NAME;
Notification.className = CLASSNAME;
Notification.defaultProps = DEFAULT_PROPS;
