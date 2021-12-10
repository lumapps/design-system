import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';
import { ColorPalette, Icon, Kind, Size } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface MessageProps extends GenericProps {
    /** Content. */
    children?: ReactNode;
    /** Whether the message has a background or not. */
    hasBackground?: boolean;
    /** Message variant. */
    kind?: Kind;
    /** Message custom icon SVG path. */
    icon?: string;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Message';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Associative map from message kind to color and icon.
 */
const CONFIG = {
    [Kind.error]: { color: ColorPalette.red, icon: mdiAlert },
    [Kind.info]: { color: ColorPalette.dark, icon: mdiInformation },
    [Kind.success]: { color: ColorPalette.green, icon: mdiCheckCircle },
    [Kind.warning]: { color: ColorPalette.yellow, icon: mdiAlertCircle },
};

/**
 * Message component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Message: Comp<MessageProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { children, className, hasBackground, kind, icon: customIcon, ...forwardedProps } = props;
    const { color, icon } = CONFIG[kind as Kind] || {};

    return (
        <div
            ref={ref}
            className={classNames(
                className,
                handleBasicClasses({
                    color,
                    hasBackground,
                    prefix: CLASSNAME,
                }),
            )}
            {...forwardedProps}
        >
            {(customIcon || icon) && <Icon className="lumx-message__icon" icon={customIcon || icon} size={Size.xs} />}
            <div className="lumx-message__text">{children}</div>
        </div>
    );
});
Message.displayName = COMPONENT_NAME;
Message.className = CLASSNAME;
