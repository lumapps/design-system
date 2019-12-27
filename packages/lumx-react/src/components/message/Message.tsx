import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';
import { ColorPalette, Icon } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement } from 'react';

/////////////////////////////

enum KindMessage {
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
    [KindMessage.error]: ColorPalette.red,
    [KindMessage.info]: ColorPalette.dark,
    [KindMessage.success]: ColorPalette.green,
    [KindMessage.warning]: ColorPalette.yellow,
};

/**
 * The icons according to kind props.
 */
const KIND_ICON = {
    [KindMessage.error]: mdiAlert,
    [KindMessage.info]: mdiInformation,
    [KindMessage.success]: mdiCheckCircle,
    [KindMessage.warning]: mdiAlertCircle,
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
    /**
     * Get message classes.
     *
     * @return The list of message classes.
     */
    function getClasses(): string[] {
        const classes: string[] = [];

        const color = kind ? KIND_COLOR[kind] : DEFAULT_PROPS.color;
        classes.push(`${CSS_PREFIX}-message--color-${color}`);

        if (hasBackground) {
            classes.push(`${CSS_PREFIX}-message--has-background`);
        }

        return classes;
    }

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
                getClasses(),
            )}
            {...forwardedProps}
        >
            <Icon className="lumx-message__icon" icon={icon} />
            <div className="lumx-message__text">{children}</div>
        </div>
    );
};
Message.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, KindMessage, Message, MessageProps };
