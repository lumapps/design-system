import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';

import { Color, ColorPalette, Icon, IconButton, Size, Theme } from 'LumX';
import { ComplexPropDefault, Emphasis } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, Omit, ValidateParameters, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { ButtonRoot, ButtonRootProps } from './ButtonRoot';

/////////////////////////////

/**
 * The authorized values for the `emphasis` prop.
 */
const ButtonEmphasis = Emphasis;

/**
 * The authorized values for the `size` prop.
 */
type ButtonSize = Size.s | Size.m;

/**
 * The authorized values for the `variant` prop.
 */
enum ButtonVariant {
    button = 'button',
    icon = 'icon',
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IButtonProps extends IGenericProps {
    /**
     * Button reference to handle focus.
     */
    buttonRef?: React.RefObject<ButtonRoot>;

    /**
     * The label.
     */
    children?: ReactNode;

    /**
     * The color.
     */
    color?: Color;

    /**
     * The emphasis.
     */
    emphasis?: Emphasis;

    /**
     * The icon that comes before the label.
     */
    leftIcon?: string;

    /**
     * The icon that comes after the label.
     */
    rightIcon?: string;

    /**
     * The size.
     */
    size?: ButtonSize;

    /**
     * The theme.
     */
    theme?: Theme;

    /**
     * The variant.
     */
    variant?: ButtonVariant;
}
type ButtonProps = IButtonProps & ButtonRootProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<Omit<ButtonProps, 'color'>> {
    color: ComplexPropDefault<Color>;
}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Button`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    buttonRef: undefined,
    color: {
        default: ColorPalette.dark,
        [`emphasis-${ButtonEmphasis.high}`]: ColorPalette.primary,
    },
    emphasis: ButtonEmphasis.high,
    size: Size.m,
    theme: Theme.light,
    variant: ButtonVariant.button,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the component after transforming and/or validating the children.
 *
 * @param params The children, their number and the props of the component.
 * @return     If a string, the error message.
 *                              If a boolean, `true` means a successful validation, `false` a bad validation (which will
 *                              lead to throw a basic error message).
 *                              You can also return nothing if there is no special problem (i.e. a successful
 *                              validation).
 */
function _postValidate({ childrenCount, props }: ValidateParameters): string | boolean | void {
    if (
        props.variant === ButtonVariant.button &&
        (!isEmpty(props.leftIcon) || !isEmpty(props.rightIcon)) &&
        childrenCount === 0
    ) {
        console.info(
            `If you want to display an icon button, maybe you should use the 'icon' \`variant\` of the <${COMPONENT_NAME}> instead of the 'button' \`variant\`\nYou should even consider using the <${
                IconButton.displayName
            }> component instead.`,
        );
    }

    return true;
}
/**
 * Globally validate the component before transforming and/or validating the children.
 *
 * @param params The children, their number and the props of the component.
 * @return     If a string, the error message.
 *                              If a boolean, `true` means a successful validation, `false` a bad validation (which will
 *                              lead to throw a basic error message).
 *                              You can also return nothing if there is no special problem (i.e. a successful
 *                              validation).
 */
function _preValidate({ childrenCount, props }: ValidateParameters): string | boolean | void {
    if (!isEmpty(props.leftIcon) && !isEmpty(props.rightIcon)) {
        if (props.variant === ButtonVariant.icon) {
            return `You cannot have 2 icons in a 'icon' \`variant\` of <${COMPONENT_NAME}>, You can only have one icon!`;
        }

        if (childrenCount === 0) {
            return `You cannot have only 2 icons in a 'button' \`variant\` of <${COMPONENT_NAME}>, you must also provide a label!`;
        }
    }

    if (isEmpty(props.leftIcon) && isEmpty(props.rightIcon) && childrenCount === 0) {
        return `You should have at least a text or <span> label or an icon in a 'button' \`variant\` of <${COMPONENT_NAME}>";`;
    }

    return true;
}

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param     props The children and props of the component.
 * @return The processed children of the component.
 */
function _validate(props: ButtonProps): ReactNode {
    return validateComponent(COMPONENT_NAME, {
        maxChildren: props.variant === ButtonVariant.icon ? 0 : undefined,
        postValidate: _postValidate,
        preValidate: _preValidate,
        props,
    });
}

/////////////////////////////

/**
 * Displays a button.
 * If the `href` property is set, it will display a `<a>` HTML tag. If not, it will use a `<button>` HTML tag instead.
 *
 * @return The component.
 */
const Button: React.FC<ButtonProps> = ({
    buttonRef = DEFAULT_PROPS.buttonRef,
    children,
    className = '',
    color,
    emphasis = DEFAULT_PROPS.emphasis,
    leftIcon,
    rightIcon,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    ...props
}: ButtonProps): ReactElement => {
    const newChildren: ReactNode = _validate({
        children,
        color,
        emphasis,
        leftIcon,
        rightIcon,
        size,
        theme,
        variant,
        ...props,
    });

    if (variant === ButtonVariant.button) {
        if (!isEmpty(leftIcon)) {
            className += isEmpty(className) ? '' : ' ';
            className += `${CLASSNAME}--has-left-icon`;
        }

        if (!isEmpty(rightIcon)) {
            className += isEmpty(className) ? '' : ' ';
            className += `${CLASSNAME}--has-right-icon`;
        }
    }

    if (isEmpty(color)) {
        color = DEFAULT_PROPS.color[`emphasis-${emphasis}`] || DEFAULT_PROPS.color.default;
    }

    return (
        <ButtonRoot
            buttonRef={buttonRef}
            className={classNames(
                className,
                handleBasicClasses({
                    color,
                    emphasis,
                    prefix: CLASSNAME,
                    size,
                    theme: emphasis === ButtonEmphasis.high ? theme : undefined,
                    variant,
                }),
            )}
            {...props}
        >
            {leftIcon !== undefined && !isEmpty(leftIcon) && <Icon icon={leftIcon} />}
            {newChildren && <span>{newChildren}</span>}
            {rightIcon !== undefined && !isEmpty(rightIcon) && <Icon icon={rightIcon} />}
        </ButtonRoot>
    );
};
Button.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ButtonEmphasis, Button, ButtonProps, ButtonVariant };
