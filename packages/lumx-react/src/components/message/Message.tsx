import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';
import { ColorPalette, Icon, Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

/////////////////////////////

enum MessageKind {
    error = 'error',
    info = 'info',
    success = 'success',
    warning = 'warning',
}

/**
 * Defines the props of the component.
 */
interface IMessageProps extends IGenericProps {
    /**
     * Message content.
     */
    children?: ReactNode;

    /**
     * The kind of message.
     */
    kind?: string;

    /**
     * Put a background to the message
     */
    hasBackground?: boolean;
}
type MessageProps = IMessageProps;

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
    [MessageKind.error]: ColorPalette.red,
    [MessageKind.info]: ColorPalette.dark,
    [MessageKind.success]: ColorPalette.green,
    [MessageKind.warning]: ColorPalette.yellow,
};

/**
 * The icons according to kind props.
 */
const KIND_ICON = {
    [MessageKind.error]: mdiAlert,
    [MessageKind.info]: mdiInformation,
    [MessageKind.success]: mdiCheckCircle,
    [MessageKind.warning]: mdiAlertCircle,
};

/////////////////////////////

/**
 * Component used to display a message, with an icon and possibly a background
 *
 * @return The component.
 */
const Message: React.FC<MessageProps> = (props: MessageProps): ReactElement => {
    const { children, className, kind, hasBackground, ...forwardedProps } = props;
    const icon = kind ? KIND_ICON[kind] : null;

    const color = kind ? KIND_COLOR[kind] : DEFAULT_PROPS.color;
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
            <Icon className="lumx-message__icon" icon={icon} size={Size.xs} />
            <div className="lumx-message__text">{children}</div>
        </div>
    );
};
Message.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, MessageKind, Message, MessageProps };
