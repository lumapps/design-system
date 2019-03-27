import React, { Children } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import { Icon, IconButton } from 'LumX';
import { Color, Colors, ComplexPropDefault, Theme, Themes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import {
    ChildTransformParameters,
    ChildValidateParameters,
    IGenericProps,
    Omit,
    getRootClassName,
    isElementOfType,
    isElementText,
    validateComponent,
} from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { ButtonRoot, ButtonRootProps } from './ButtonRoot';

/////////////////////////////

/**
 * The authorized values for the `emphasis` prop.
 */
enum Emphasises {
    low = 'low',
    medium = 'medium',
    high = 'high',
}
type Emphasis = Emphasises;

/**
 * The authorized values for the `size` prop.
 */
enum Sizes {
    s = 's',
    m = 'm',
}
type Size = Sizes;

/**
 * The authorized values for the `variant` prop.
 */
enum Variants {
    button = 'button',
    icon = 'icon',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IButtonProps extends IGenericProps {
    /**
     * The button color.
     */
    color?: Color;

    /**
     * The emphasis of the button.
     */
    emphasis?: Emphasis;

    /**
     * The button size.
     */
    size?: Size;

    /**
     * The button theme.
     */
    theme?: Theme;

    /**
     * The button variant.
     */
    variant?: Variant;
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
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Button`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    color: {
        default: Colors.dark,
        [`emphasis-${Emphasises.high}`]: Colors.primary,
    },
    emphasis: Emphasises.high,
    size: Sizes.m,
    theme: Themes.light,
    variant: Variants.button,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Transform a text child to <span>.
 *
 * @param  {ChildTransformParameters} params The parameters received from the `validateComponent` function.
 * @return {React.ReactNode}          The transformed child (or the original one if there is no transformation to do).
 */
function _transformChild({ child }: ChildTransformParameters): React.ReactNode {
    if (isString(child)) {
        return <span>{child}</span>;
    }

    return child;
}

/**
 * Returns a closure for the function to validate a child of the component.
 * This closure will help remembering the types of the previous children. This list will help to determine if there is
 * no excess children of a given type.
 *
 * @param  {Array<string>} childrenTypes The list of types of the previously validated children.
 * @return {Function}      The closured function to validate a child of the component.
 */
function _validateChild(childrenTypes: string[]): (params: ChildValidateParameters) => void {
    /**
     * Validate a of the component
     *
     * @param {ChildValidateParameters} params The parameters received from the `validateComponent` function.
     */
    return ({ child, childrenCount, index }: ChildValidateParameters): void => {
        const isChildText: boolean = isElementText(child) || isElementOfType(child, <span />);
        const isChildIcon: boolean = isElementOfType(child, Icon);

        const alreadyHasSomeText: boolean =
            index === 0 ? false : childrenTypes.some((type: string): boolean => type === 'text');
        childrenTypes[index] = isChildText ? 'text' : 'icon';

        if (isChildText && alreadyHasSomeText) {
            throw new Error(
                `You cannot have more than 1 label in a 'button' \`variant\` of <${COMPONENT_NAME}> (got at least 2)!`,
            );
        }

        if (!isChildIcon) {
            return;
        }

        if (childrenCount === 1) {
            console.info(
                `If you want to display an icon button, you should use the 'icon' \`variant\` of the <${COMPONENT_NAME}> instead of the 'button' \`variant\`\nYou should even consider using the <${
                    IconButton.displayName
                }> component instead.`,
            );
        }

        const isPreviousChildIcon: boolean = childrenTypes[index - 1] === 'icon';
        if (index > 0 && isPreviousChildIcon) {
            throw new Error(
                `You cannot have 2 following icons children in a 'button' \`variant\` of <${COMPONENT_NAME}>, there must be a label between them!`,
            );
        }
    };
}

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {ButtonProps}     props The children and props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: ButtonProps): React.ReactNode {
    const childrenTypes: string[] = [];

    return validateComponent(COMPONENT_NAME, {
        allowedTypes: props.variant === Variants.icon ? [Icon] : ['text', <span />, Icon],
        maxChildren: props.variant === Variants.icon ? 1 : 3,
        minChildren: 1,
        props,
        transformChild: props.variant === Variants.button ? _transformChild : undefined,
        validateChild: props.variant === Variants.button ? _validateChild(childrenTypes) : undefined,
    });
}

/////////////////////////////

/**
 * Displays a button.
 * If the `href` property is set, it will display a `<a>` HTML tag. If not, it will use a `<button>` HTML tag instead.
 *
 * @return {React.ReactElement} The component.
 */
const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    color,
    emphasis = DEFAULT_PROPS.emphasis,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    ...props
}: ButtonProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, color, emphasis, size, theme, variant, ...props });

    if (variant === Variants.button) {
        let index: number = -1;
        Children.forEach(
            // @ts-ignore
            newChildren,
            (child: React.ReactNode): void => {
                index++;

                if (isElementOfType(child, Icon)) {
                    className += isEmpty(className) ? '' : ' ';
                    className += `${CLASSNAME}--has-${index === 0 ? 'left' : 'right'}-icon`;
                }
            },
        );
    }

    if (isEmpty(color)) {
        color = DEFAULT_PROPS.color[`emphasis-${emphasis}`] || DEFAULT_PROPS.color.default;
    }

    return (
        <ButtonRoot
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,

                    color,
                    emphasis,
                    size,
                    theme: emphasis === Emphasises.high ? theme : undefined,
                    variant,
                }),
            )}
            {...props}
        >
            {newChildren}
        </ButtonRoot>
    );
};
Button.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    Button,
    ButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
    Variant,
    Variants,
};
