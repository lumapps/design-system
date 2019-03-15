import { Color, Emphasis, Size, Theme, Variant } from 'components';

/////////////////////////////

import React, { Children } from 'react';

import classNames from 'classnames';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import { isElementOfType, isElementText } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { LxIcon } from 'LumX';

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
 * Defines the props of the <LxButtonRoot> component.
 */
interface ILxButtonRootProps {
    /**
     * Basic react `children` prop.
     */
    children: React.ReactNode;

    /**
     * Basic react `className` prop.
     */
    className?: string;

    /**
     * Indicates if the button is disabled or not.
     */
    disabled?: boolean;

    /**
     * The `href` to reach if there is one.
     */
    href?: string;

    /**
     * The `target` to open the `href` into.
     */
    target?: string;
}

/////////////////////////////

/**
 * The root of the <LxButton> component.
 * Conditionnaly adds a `<a>` or a `<button>` HTML tag whether there is an `href` attribute or not.
 *
 * @return {JSX.Element} The <LxButton> root component.
 */
const LxButtonRoot: React.FC<ILxButtonRootProps> = ({
    href,
    children,
    target,
    className,
    ...props
}: ILxButtonRootProps): JSX.Element => {
    if (isEmpty(href)) {
        return (
            <button className={className} {...props}>
                {children}
            </button>
        );
    }

    return (
        <a href={href} target={target} className={className} {...props}>
            {children}
        </a>
    );
};

/////////////////////////////
/////////////////////////////

/**
 * Defines the props of the <LxButton> component.
 */
interface ILxButtonProps extends ILxButtonRootProps {
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
type LxButtonProps = ILxButtonProps;

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the <LxButton> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {ILxButtonProps}  props The children and props of the <LxButton> component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate({ children, variant }: ILxButtonProps): React.ReactNode {
    let newChildren: React.ReactNode = children;

    const childrenCount: number = Children.count(children);
    if (childrenCount === 0) {
        throw new Error('Your <LxButton> must have at least 1 child for the label or the icon (got 0)!');
    }

    if (variant === 'button') {
        if (childrenCount > 3) {
            throw new Error(
                `You cannot have more than 3 children (an icon, a label, another icon) in a 'button' <LxButton> (got ${childrenCount})!`,
            );
        }

        let index: number = -1;
        const childrenTypes: string[] = [];
        newChildren = Children.map(
            children,
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
                        `You cannot have more than 1 text or <span> child (for the label) in a 'button' <LxButton> (got at least 2)!`,
                    );
                }

                if (isChildIcon) {
                    if (childrenCount === 1) {
                        console.warn(
                            "If you want to display an icon button, you should use the 'icon' variant of the <LxButton> instead of the 'button' variant\nYou should even consider using the <LxIconButton> component instead.",
                        );
                    }

                    if (index > 0 && childrenTypes[index - 1] === 'icon') {
                        throw new Error(
                            `You cannot have 2 icons children following in a 'button' <LxButton>, there must be 1 text or <span> children (for the label) between them!`,
                        );
                    }
                }

                return newChild;
            },
        );
    } else if (variant === 'icon') {
        if (childrenCount > 1) {
            throw new Error(`You cannot have more than 1 child in an 'icon' <LxButton> (got ${childrenCount})!`);
        }

        Children.forEach(
            children,
            (child: any): void => {
                if (isElementOfType(child, LxIcon)) {
                    return;
                }

                throw new Error(
                    `You can only have a <LxIcon> child in an 'icon' <LxButton> (got ${get(
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
 * Displays a button.
 * If the `href` property is set, it will display a `<a>` HTML tag. If not, it will use a `<button>` HTML tag instead.
 *
 * @return {JSX.Element} The <LxButton> component.
 */
const LxButton: React.FC<ILxButtonProps> = ({
    children,
    className = '',
    color,
    emphasis = 'high',
    size = 'm',
    theme = 'light',
    variant = 'button',
    ...props
}: ILxButtonProps): JSX.Element => {
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

    const isDefaultEmphasis: boolean = emphasis === 'high';
    if (isEmpty(color)) {
        color = isDefaultEmphasis ? 'primary' : 'dark';
    }

    return (
        <LxButtonRoot
            className={classNames(
                className,
                handleBasicClasses({ color, emphasis, size, theme, variant, prefix: CLASSNAME }),
            )}
            {...props}
        >
            {children}
        </LxButtonRoot>
    );
};
LxButton.displayName = 'LxButton';

/////////////////////////////

export { CLASSNAME, LxButton, LxButtonProps };
