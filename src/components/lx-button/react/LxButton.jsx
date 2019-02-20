import React from 'react';
import classNames from 'classnames';

import { handleBasicClasses } from '../../../core/utils';
import '../style/lx-button.scss';

const LxButtonRoot = ({ href, children, ...props }) => {
    return href ? (
        <a href={href} {...props}>
            {children}
        </a>
    ) : (
        <button {...props}>{children}</button>
    );
};

const LxButton = ({
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

export { LxButton };
