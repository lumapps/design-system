import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiClose, mdiInformation } from '@lumx/icons';
import { ColorPalette, Emphasis, Kind, Size } from '../../constants';
import type { JSXElement, LumxClassName, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';
import { IconButton } from '../Button/IconButton';

/**
 * Defines the props of the component.
 */
export interface MessageProps extends HasClassName {
    /** Content. */
    children?: JSXElement;
    /** Whether the message has a background or not. */
    hasBackground?: boolean;
    /** Message variant. */
    kind?: Kind;
    /** Message custom icon SVG path. */
    icon?: string;
    /** Reference to the message container element. */
    ref?: CommonRef;
    /**
     * Displays a close button.
     *
     * NB: only available if `kind === 'info' && hasBackground === true`
     */
    closeButtonProps?: {
        /** The callback called when the button is clicked */
        onClick: ((event: any) => void) | null;
        /** The label of the close button. */
        label: string;
    };
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Message';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-message';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Associative map from message kind to color and icon.
 */
export const CONFIG = {
    [Kind.error]: { color: ColorPalette.red, icon: mdiAlert },
    [Kind.info]: { color: ColorPalette.blue, icon: mdiInformation },
    [Kind.success]: { color: ColorPalette.green, icon: mdiCheckCircle },
    [Kind.warning]: { color: ColorPalette.yellow, icon: mdiAlertCircle },
};

/**
 * Message component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Message = (props: MessageProps) => {
    const {
        children,
        className,
        hasBackground,
        kind,
        icon: customIcon,
        closeButtonProps,
        ref,
        ...forwardedProps
    } = props;
    const { color, icon } = CONFIG[kind as Kind] || {};
    const { onClick, label: closeButtonLabel } = closeButtonProps || {};
    const isCloseButtonDisplayed = hasBackground && kind === 'info' && onClick && closeButtonLabel;

    return (
        <div
            {...forwardedProps}
            ref={ref}
            className={classNames.join(
                className,
                block({
                    [`color-${color}`]: Boolean(color),
                    'has-background': hasBackground,
                }),
            )}
        >
            {(customIcon || icon) &&
                Icon({ className: element('icon'), icon: customIcon || icon, size: Size.xs, color })}
            <div className={element('text')}>{children}</div>
            {isCloseButtonDisplayed &&
                IconButton({
                    className: element('close-button'),
                    icon: mdiClose,
                    onClick,
                    label: closeButtonLabel,
                    emphasis: Emphasis.low,
                })}
        </div>
    );
};

Message.displayName = COMPONENT_NAME;
Message.className = CLASSNAME;
