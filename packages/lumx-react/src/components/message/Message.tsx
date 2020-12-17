import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';
import { ColorPalette, Icon, Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';

export enum MessageKind {
    error = 'error',
    info = 'info',
    success = 'success',
    warning = 'warning',
}

/**
 * Defines the props of the component.
 */
export interface MessageProps extends GenericProps {
    /** The children elements. */
    children?: ReactNode;
    /** Whether the message has a background or not. */
    hasBackground?: boolean;
    /** The kind of helper (error or sucess for exemple). */
    kind?: MessageKind;
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

/**
 * Message component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Message: Comp<MessageProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { children, className, hasBackground, kind, ...forwardedProps } = props;
    const icon = kind ? KIND_ICON[kind as MessageKind] : null;

    const color = kind ? KIND_COLOR[kind as MessageKind] : DEFAULT_PROPS.color;
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
            {icon && <Icon className="lumx-message__icon" icon={icon} size={Size.xs} />}
            <div className="lumx-message__text">{children}</div>
        </div>
    );
});
Message.displayName = COMPONENT_NAME;
Message.className = CLASSNAME;
Message.defaultProps = DEFAULT_PROPS;
