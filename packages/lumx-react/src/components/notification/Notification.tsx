import { useRef } from 'react';
import type { ElementType, ReactElement, Ref } from 'react';

import { Emphasis, Kind, Size, Theme } from '@lumx/core/js/constants';
import { Button, ButtonProps, Icon } from '@lumx/react';
import { DOCUMENT, NOTIFICATION_TRANSITION_DURATION } from '@lumx/react/constants';
import { NOTIFICATION_CONFIGURATION } from '@lumx/react/components/notification/constants';
import type { LumxClassName, GenericProps, HasTheme } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import type { HasPolymorphicAs } from '@lumx/react/utils/type';

import { Portal } from '@lumx/react/utils';

/**
 * Props of the notification action.
 * Without `as`: props of a `Button`, with a `label` used as its content.
 * With `as`: props of that component.
 * Both get the medium `emphasis` and the `theme` of the notification as defaults.
 */
export type NotificationActionProps<E extends ElementType = typeof Button> =
    | (Omit<ButtonProps, 'children'> & { as?: undefined; label?: string })
    | (HasPolymorphicAs<E> & { as: E });

/**
 * Defines the props of the component.
 */
export interface NotificationProps<E extends ElementType = typeof Button> extends GenericProps, HasTheme {
    /**
     * Action button label.
     * @deprecated Use `actionProps.label` instead.
     */
    actionLabel?: string;
    /** Displays the action (`{ label, onClick }`, or `{ as: IconButton, icon, label, onClick }`, etc.). */
    actionProps?: NotificationActionProps<E>;
    /** Content. */
    content?: React.ReactNode;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Notification type. */
    type?: Kind;
    /** Z-axis position. */
    zIndex?: number;
    /**
     * On action button click callback.
     * @deprecated Use `actionProps.onClick` instead.
     */
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
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<NotificationProps> = {
    zIndex: 9999,
    usePortal: true,
};

/**
 * Notification component type, generic on the `as` component of `actionProps`.
 */
type NotificationComponent = {
    <E extends ElementType = typeof Button>(
        props: NotificationProps<E> & { ref?: Ref<HTMLDivElement> },
    ): ReactElement | null;
    readonly $$typeof: symbol;
    displayName: typeof COMPONENT_NAME;
    className: typeof CLASSNAME;
    defaultProps: Partial<NotificationProps>;
};

/* eslint-disable react-hooks/rules-of-hooks, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/**
 * Notification component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Notification = forwardRef<NotificationProps<ElementType>, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        actionLabel,
        actionProps,
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
    const {
        as: Action,
        label: actionPropsLabel = actionLabel,
        onClick: onActionPropsClick,
        ...forwardedActionProps
    } = actionProps || {};
    // A `Button` without a label has no accessible name.
    const hasAction = Boolean(Action) || (Boolean(actionPropsLabel) && Boolean(actionProps || onActionClick));

    const handleActionClick = (evt: React.MouseEvent) => {
        if (onActionPropsClick) onActionPropsClick(evt);
        // The deprecated callback is typed with no argument.
        else onActionClick?.();
        evt.stopPropagation();
    };
    const commonActionProps = {
        emphasis: Emphasis.medium,
        theme,
        ...forwardedActionProps,
        onClick: handleActionClick,
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
                className={classNames.join(
                    className,
                    block({
                        [`color-${color}`]: Boolean(color),
                        'has-action': hasAction,
                        'is-hidden': !isOpen,
                    }),
                )}
                onClick={onClick}
                style={{ ...style, zIndex }}
            >
                <div className={element('icon')}>
                    <Icon icon={icon} size={Size.s} />
                </div>
                <div className={element('content')}>{content}</div>
                {hasAction && (
                    <div className={element('action')}>
                        {Action ? (
                            <Action {...commonActionProps} label={actionPropsLabel} />
                        ) : (
                            <Button {...commonActionProps}>
                                <span>{actionPropsLabel}</span>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Portal>
    );
}) as unknown as NotificationComponent;
Notification.displayName = COMPONENT_NAME;
Notification.className = CLASSNAME;
Notification.defaultProps = DEFAULT_PROPS;
