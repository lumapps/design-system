import React from 'react';
import classNames from 'classnames';

import '../style/lx-button.scss';

import { handleBasicClasses } from '../../../core/utils';
import { Color, Theme, Size, Variant } from 'components';

interface LxButtonRootProps {
    /** Basic react `className` prop. */
    className?: string;
    /** The `href` to reach if there is one. */
    href?: string;
    /** The `target` html property. */
    target?: string;
}

/**
 * Conditionnaly adds `a` or `button` html tag whether there is an `href` attribute or not.
 */
const LxButtonRoot: React.FC<LxButtonRootProps> = ({ href, children, target, className, ...props }) => {
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

export interface LxButtonProps extends LxButtonRootProps {
    /** The button color which must be defined by `lx-button--${color}` css class. */
    color?: Color;
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
 */
export const LxButton: React.FC<LxButtonProps> = ({
    children,
    className,
    color = 'primary',
    variant = 'primary',
    size = 'm',
    theme = 'light',
    ...props
}) => (
    <LxButtonRoot
        className={classNames(className, handleBasicClasses({ color, size, theme, variant, prefix: 'lx-button' }))}
        {...props}
    >
        {children}
    </LxButtonRoot>
);
