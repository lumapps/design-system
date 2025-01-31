import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiClose, mdiInformation } from '@lumx/icons';
import { ColorPalette, Emphasis, Icon, IconButton, Kind, Size } from '@lumx/react';
import type { GenericProps, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
    /**
     * Displays a close button.
     *
     * NB: only available if `kind === 'info' && hasBackground === true`
     */
    closeButtonProps?: {
        /** The callback called when the button is clicked */
        onClick: () => void;
        /** The label of the close button. */
        label: string;
    };
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Message';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-message';

/**
 * Associative map from message kind to color and icon.
 */
const CONFIG = {
    [Kind.error]: { color: ColorPalette.red, icon: mdiAlert },
    [Kind.info]: { color: ColorPalette.blue, icon: mdiInformation },
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
export const Message = forwardRef<MessageProps, HTMLDivElement>((props, ref) => {
    const { children, className, hasBackground, kind, icon: customIcon, closeButtonProps, ...forwardedProps } = props;
    const { color, icon } = CONFIG[kind as Kind] || {};
    const { onClick, label: closeButtonLabel } = closeButtonProps || {};
    const isCloseButtonDisplayed = hasBackground && kind === 'info' && onClick && closeButtonLabel;

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
            {(customIcon || icon) && (
                <Icon className={`${CLASSNAME}__icon`} icon={customIcon || icon} size={Size.xs} color={color} />
            )}
            <div className={`${CLASSNAME}__text`}>{children}</div>
            {isCloseButtonDisplayed && (
                <IconButton
                    className={`${CLASSNAME}__close-button`}
                    icon={mdiClose}
                    onClick={onClick}
                    label={closeButtonLabel}
                    emphasis={Emphasis.low}
                />
            )}
        </div>
    );
});

Message.displayName = COMPONENT_NAME;
Message.className = CLASSNAME;
