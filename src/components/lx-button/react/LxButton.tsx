import { Color, ComplexPropDefault, Emphasis, Size, Theme, Variant } from 'components';

import { LxButtonRootProps } from './LxButtonRoot';

/////////////////////////////

import React, { Children } from 'react';

import classNames from 'classnames';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import { LxIcon } from 'LumX';
import { isElementOfType, isElementText, unwrapFragment } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { LxButtonRoot } from './LxButtonRoot';

/////////////////////////////

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = 'lx-button';

/////////////////////////////

/**
 * Defines the props of the <LxButton> component.
 */
interface ILxButtonProps {
    /**
     * The button color which must be defined by `lx-button--${color}` css class.
     */
    color?: Color;

    /**
     * The emphasis of the button which must be defined by `lx-button-emphasis--${emphasis}` css class.
     */
    emphasis?: Emphasis;

    /**
     * The button size which must be defined by `lx-button--${size}` css class.
     */
    size?: Size;

    /**
     * The button theme which must be defined by `lx-button--${theme}` css class.
     */
    theme?: Theme;

    /**
     * The button variant which must be defined by `lx-type--${variant}` css class.
     */
    variant?: Variant;
}
type LxButtonProps = ILxButtonProps & LxButtonRootProps;

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the <LxButton> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {LxButtonProps}   props The children and props of the <LxButton> component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate({ children, variant }: LxButtonProps): React.ReactNode {
    let newChildren: React.ReactNode = children;

    let childrenCount: number = Children.count(newChildren);
    if (childrenCount === 0) {
        throw new Error('Your <LxButton> must have at least 1 child for the label or the icon (got 0)!');
    }

    newChildren = unwrapFragment(newChildren);
    childrenCount = Children.count(newChildren);

    if (variant === 'button') {
        if (childrenCount > 3) {
            throw new Error(
                `You cannot have more than 3 children (an icon, a label, another icon) in a 'button' \`variant\` of <LxButton> (got ${childrenCount})!`,
            );
        }

        let index: number = -1;
        const childrenTypes: string[] = [];
        newChildren = Children.map(
            newChildren,
            (child: any): React.ReactElement => {
                index++;

                let newChild: React.ReactElement = child;
                if (isString(child)) {
                    newChild = <span>{child}</span>;
                }

                const isChildText: boolean = isElementText(newChild);
                const isChildIcon: boolean = isElementOfType(newChild, LxIcon);

                if (!isChildText && !isChildIcon) {
                    throw new Error(
                        `The children of a <LxButton> must be either of type text, <span> or <LxIcon> (got '${get(
                            newChild.type,
                            'name',
                            newChild.type,
                        ) || `'${child}'`}}')!`,
                    );
                }

                childrenTypes[index] = isChildText ? 'text' : 'icon';

                if (isChildText && index > 0 && childrenTypes[index - 1] === 'text') {
                    throw new Error(
                        `You cannot have more than 1 text or <span> child (for the label) in a 'button' \`variant\` of <LxButton> (got at least 2)!`,
                    );
                }

                if (isChildIcon) {
                    if (childrenCount === 1) {
                        console.warn(
                            "If you want to display an icon button, you should use the 'icon' `variant` of the <LxButton> instead of the 'button' `variant`\nYou should even consider using the <LxIconButton> component instead.",
                        );
                    }

                    if (index > 0 && childrenTypes[index - 1] === 'icon') {
                        throw new Error(
                            `You cannot have 2 icons children following in a 'button' \`variant\` of <LxButton>, there must be 1 text or <span> children (for the label) between them!`,
                        );
                    }
                }

                return newChild;
            },
        );
    } else if (variant === 'icon') {
        if (childrenCount > 1) {
            throw new Error(
                `You cannot have more than 1 child in an 'icon' \`variant\` of <LxButton> (got ${childrenCount})!`,
            );
        }

        Children.forEach(
            newChildren,
            (child: any): void => {
                if (isElementOfType(child, LxIcon)) {
                    return;
                }

                throw new Error(
                    `You can only have a <LxIcon> child in an 'icon' \`variant\` of <LxButton> (got ${get(
                        child.type,
                        'name',
                        child.type,
                    ) || `'${child}'`})!`,
                );
            },
        );
    }

    return newChildren;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxButtonDefaultPropsType {
    color: ComplexPropDefault<Color>;
    emphasis: Emphasis;
    size: Size;
    theme: Theme;
    variant: Variant;
}

/**
 * The default value of props.
 *
 * @type {ILxButtonDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxButtonDefaultPropsType = {
    color: {
        default: 'dark' as Color,
        'emphasis-high': 'primary' as Color,
    },
    emphasis: 'high' as Emphasis,
    size: 'm' as Size,
    theme: 'light' as Theme,
    variant: 'button' as Variant,
};

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
    children = _validate({ children, className, color, emphasis, size, theme, variant, ...props });

    if (variant === 'button') {
        let index = -1;
        Children.forEach(
            children,
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
                handleBasicClasses({ prefix: CLASSNAME, color, emphasis, size, theme, variant }),
            )}
            {...props}
        >
            {children}
        </LxButtonRoot>
    );
};
LxButton.displayName = 'LxButton';

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, LxButton, LxButtonProps };
