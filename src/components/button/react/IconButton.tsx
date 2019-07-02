import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { ValidateParameters, getRootClassName, validateComponent } from 'LumX/core/react/utils';

import { Button, ButtonProps, Color, Colors, Emphasis, Emphasises, Size, Sizes, Theme, Themes } from './Button';

/////////////////////////////

enum Variants {
    icon = 'icon',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends ButtonProps {
    /**
     * The icon.
     */
    icon: string;

    /**
     * Don't allow usage of `leftIcon` or `rightIcon` and use `icon` instead.
     */
    leftIcon?: never;
    rightIcon?: never;

    /**
     * The <IconButton> should never have the `variant` prop as this prop is forced to 'icon' in the <Button>.
     */
    variant?: never;
}
type IconButtonProps = IProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<IconButtonProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}IconButton`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

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
function _postValidate({ props }: ValidateParameters): string | boolean | void {
    if (!isEmpty(props.variant)) {
        console.warn(
            `You shouldn't pass the \`variant\` prop in a <${COMPONENT_NAME}> as it's forced to 'icon' (got '${
                props.variant
            }')!`,
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
function _preValidate({ props }: ValidateParameters): string | boolean | void {
    if (!isEmpty(props.leftIcon)) {
        return `You must use the \`icon\` prop of <${COMPONENT_NAME}> instead of \`leftIcon\`!`;
    }

    if (!isEmpty(props.rightIcon)) {
        return `You must use the \`icon\` prop of <${COMPONENT_NAME}> instead of \`rightIcon\`!`;
    }

    if (isEmpty(props.icon)) {
        return `You must have an \`icon\` in a <${COMPONENT_NAME}>!`;
    }
}

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param props The children and props of the component.
 * @return The processed children of the component.
 */
function _validate(props: IconButtonProps): ReactNode {
    return validateComponent(COMPONENT_NAME, {
        maxChildren: 0,
        postValidate: _postValidate,
        preValidate: _preValidate,
        props,
    });
}

/////////////////////////////

/**
 * Displays an icon button.
 * It's like a <Button> but only displays an icon instead of a label in the body of the button.
 *
 * Note that you cannot use the `variant` prop in this component.
 *
 * @see {@link Button} for more information on <Button>.
 *
 * @return The component.
 */
const IconButton: React.FC<IconButtonProps> = ({
    children,
    className = '',
    icon,
    // @ts-ignore
    leftIcon = '',
    // @ts-ignore
    rightIcon = '',
    ...props
}: IconButtonProps): ReactElement => {
    _validate({ children, icon, leftIcon, rightIcon, ...props });

    return <Button className={classNames(className, CLASSNAME)} {...props} leftIcon={icon} variant={Variants.icon} />;
};
IconButton.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    IconButton,
    IconButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
    Variant,
    Variants,
};
