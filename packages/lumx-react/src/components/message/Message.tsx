import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';
import { ColorPalette, Icon, Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

enum MessageKind {
    error = 'error',
    info = 'info',
    success = 'success',
    warning = 'warning',
}

/**
 * Defines the props of the component.
 */
interface MessageProps extends GenericProps {
    /** The children elements. */
    children?: ReactNode;
    /** Whether the message has a background or not. */
    hasBackground?: boolean;
    /** The kind of helper (error or sucess for example). */
    kind?: ValueOf<MessageKind>;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Message`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<MessageProps> = {
    color: ColorPalette.dark,
};

/**
 * The color according to kind props.
 */
const KIND_COLOR = {
    [MessageKind.error as string]: ColorPalette.red,
    [MessageKind.info as string]: ColorPalette.dark,
    [MessageKind.success as string]: ColorPalette.green,
    [MessageKind.warning as string]: ColorPalette.yellow,
};

/**
 * The icons according to kind props.
 */
const KIND_ICON = {
    [MessageKind.error as string]: mdiAlert,
    [MessageKind.info as string]: mdiInformation,
    [MessageKind.success as string]: mdiCheckCircle,
    [MessageKind.warning as string]: mdiAlertCircle,
};

const Message: React.FC<MessageProps> = ({ children, className, hasBackground, kind, ...forwardedProps }) => {
    const icon = kind ? KIND_ICON[kind as string] : null;

    const color = kind ? KIND_COLOR[kind as string] : DEFAULT_PROPS.color;
    return (
        <div
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
            {icon && <Icon className="lumx-message__icon" icon={icon} size={Size.xs} />}
            <div className="lumx-message__text">{children}</div>
        </div>
    );
};
Message.displayName = COMPONENT_NAME;
Message.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, MessageKind, Message, MessageProps };
