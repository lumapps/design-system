import { Color, Colors, ComplexPropDefault, Size, Sizes, Theme, Themes } from 'LumX/components';

/////////////////////////////

import React, { Children } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import { LxIcon, LxIconButton } from 'LumX';
import { CSS_PREFIX } from 'LumX/core/constants';
import {
    ChildTransformParameters,
    ChildValidateParameters,
    isElementOfType,
    isElementText,
    Omit,
    validateComponent,
} from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { LxButtonRoot, LxButtonRootProps } from './ButtonRoot';

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
 * The authorized values for the `variant` prop.
 */
enum Variants {
    button = 'button',
    icon = 'icon',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the <LxButton> component.
 */
interface IProps {
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
type LxButtonProps = IProps & LxButtonRootProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxButtonDefaultPropsType extends Partial<Omit<LxButtonProps, 'color'>> {
    color: ComplexPropDefault<Color>;
}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = `${CSS_PREFIX}-button`;

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = 'LxButton';

/**
 * The default value of props.
 *
 * @type {ILxButtonDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxButtonDefaultPropsType = {
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
 * Transform the text children to <span>s when validating the children of the <LxButton> component.
 *
 * @param  {ChildTransformParameters} params The parameters received from the `validateComponent` function.
 * @return {React.ReactElement}       The transformed children (or the original one if there is no transformation to
 *                                    do).
 */
function _transformChild({ child }: ChildTransformParameters): React.ReactElement {
    if (isString(child)) {
        return <span>{child}</span>;
    }

    return child;
}

/**
 * Returns a closure for the function to validate the children of the <LxButton> component.
 * This closure will help remembering the types of the previous children. This list will help to determine if there is
 * no excess children of a given type.
 *
 * @param  {Array<string>} childrenTypes The list of types of the previously validated children.
 * @return {Function}      The closured function to validate the children of the <LxButton> component.
 */
function _validateChild(childrenTypes: string[]): (params: ChildValidateParameters) => void {
    /**
     * Validate the children of the <LxButton> component
     *
     * @param {ChildValidateParameters} params The parameters received from the `validateComponent` function.
     */
    return ({ child, childrenCount, index }: ChildValidateParameters): void => {
        const isChildText: boolean = isElementText(child) || isElementOfType(child, <span />);
        const isChildIcon: boolean = isElementOfType(child, LxIcon);

        const alreadyHasSomeText: boolean = index === 0 ? false : childrenTypes.some((type: string) => type === 'text');
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
            console.warn(
                `If you want to display an icon button, you should use the 'icon' \`variant\` of the <${COMPONENT_NAME}> instead of the 'button' \`variant\`\nYou should even consider using the <${
                    LxIconButton.displayName
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
 * Validate the <LxButton> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {LxButtonProps}   props The children and props of the <LxButton> component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: LxButtonProps): React.ReactNode {
    const childrenTypes: string[] = [];

    return validateComponent(COMPONENT_NAME, {
        allowedTypes: props.variant === Variants.icon ? [LxIcon] : ['text', <span />, LxIcon],
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
 * @return {JSX.Element} The <LxButton> component.
 */
const LxButton: React.FC<LxButtonProps> = ({
    children,
    className = '',
    color,
    emphasis = DEFAULT_PROPS.emphasis,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    ...props
}: LxButtonProps): JSX.Element => {
    const newChildren = _validate({ children, color, emphasis, size, theme, variant, ...props });

    if (variant === Variants.button) {
        let index = -1;
        Children.forEach(
            newChildren,
            (child: any): void => {
                index++;

                if (isElementOfType(child, LxIcon)) {
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
        <LxButtonRoot
            className={classNames(
                className,
                handleBasicClasses({
                    color,
                    emphasis,
                    prefix: CLASSNAME,
                    size,
                    theme: emphasis === Emphasises.high ? theme : undefined,
                    variant,
                }),
            )}
            {...props}
        >
            {newChildren}
        </LxButtonRoot>
    );
};
LxButton.displayName = COMPONENT_NAME;

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    Color,
    Colors,
    Emphasis,
    Emphasises,
    LxButton,
    LxButtonProps,
    Size,
    Sizes,
    Theme,
    Themes,
    Variant,
    Variants,
};
