import { Color, Emphasis, Size, Theme, Variant } from 'components';

/////////////////////////////

import React, { Children } from 'react';

import classNames from 'classnames';

import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import { handleBasicClasses } from 'LumX/core/utils';

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
 * Defines the props of the LxButtonRoot component.
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
 * The root of LxButton.
 * Conditionnaly adds a `a` or a `button` HTML tag whether there is an `href` attribute or not.
 *
 * @return {JSX.Element} The LxButton root component.
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
 * Defines the props of the LxButton component.
 */
interface ILxButtonProps extends ILxButtonRootProps {
    /**
     * The button color which must be defined by `lx-button--${color}` css class.
     */
    color?: Color;

    /**
     * The emphasis of the button which must be defined by ``lx-button-emphasis--${emphasis} css class.
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

/**
 * Displays a button.
 * If `href` property is set, it will display a `a` HTML tag. If not, it will use a `button` HTML tag instead.
 *
 * @return {JSX.Element} The LxButton component.
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
    const isDefaultEmphasis = emphasis === 'high';
    if (isEmpty(color)) {
        color = isDefaultEmphasis ? 'primary' : 'dark';
    }

    if (variant === 'button') {
        let index = -1;
        children = Children.map(
            children,
            (child: any): JSX.Element => {
                index++;

                if (isString(child)) {
                    return <span>{child}</span>;
                }

                if (!isString(child.type) && has(child.props, 'icon')) {
                    className += `${isEmpty(className) ? '' : ' '}${CLASSNAME}--has-${
                        index === 0 ? 'left' : 'right'
                    }-icon`;
                }

                return child;
            },
        );
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

/////////////////////////////

export { CLASSNAME, LxButton, LxButtonProps };
