import { Color, Emphasis, Size, Theme, Variant } from 'components';

import React from 'react';

import classNames from 'classnames';

import { handleBasicClasses } from 'LumX/core/utils';

interface ILxButtonRootProps {
    /** Basic react `className` prop. */
    className?: string;
    /** Indicates if the button is disabled or not. */
    disabled?: boolean;
    /** The `href` to reach if there is one. */
    href?: string;
    /** The `target` html property. */
    target?: string;
}

/**
 * Conditionnaly adds `a` or `button` html tag whether there is an `href` attribute or not.
 *
 * @return {React.FC<ILxButtonRootProps>} The button root component.
 */
const LxButtonRoot: React.FC<ILxButtonRootProps> = ({ href, children, target, className, ...props }) => {
    return href ? (
        <a href={href} target={target} className={className} {...props}>
            {children}
        </a>
    ) : (
        <button className={className} {...props}>
            {children}
        </button>
    );
};

export interface ILxButtonProps extends ILxButtonRootProps {
    /** The button color which must be defined by `lx-button--${color}` css class. */
    color?: Color;
    /** The emphasis of the button which must be defined by ``lx-button-emphasis--${emphasis} css class. */
    emphasis?: Emphasis;
    /** The button size which must be defined by `lx-button--${size}` css class. */
    size?: Size;
    /** The button theme which must be defined by `lx-button--${theme}` css class. */
    theme?: Theme;
    /** The button variant which must be defined by `lx-type--${variant}` css class. */
    variant?: Variant;
}

/**
 * Displays a button. If `href` property is set, it will display an `a` tag, if not
 * it will use `button` tag instead.
 *
 * @return {React.FC<ILxButtonProps>} The button component.
 */
export const LxButton: React.FC<ILxButtonProps> = ({
    children,
    className,
    color = '',
    emphasis = 'high',
    size = 'm',
    theme = 'light',
    variant = 'button',
    ...props
}) => {
    if (!color) {
        if (!emphasis || emphasis === 'high') {
            color = 'primary';
        } else {
            color = 'dark';
        }
    }

    return (
        <LxButtonRoot
            className={classNames(
                className,
                handleBasicClasses({ color, emphasis, size, theme, variant, prefix: 'lx-button' }),
            )}
            {...props}
        >
            {children}
        </LxButtonRoot>
    );
};
