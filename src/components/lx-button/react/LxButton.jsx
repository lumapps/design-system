import React from 'react';
import classNames from 'classnames';

import { handleBasicLxClasses } from '../../../core/utils';
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

const LxButton = ({ children, ...props }) => (
    <LxButtonRoot
        className={classNames(handleBasicLxClasses({ prefix: 'lx-button', ...props }), 'lx-button--shape-contained')}
        {...props}
    >
        <span className="lx-button__text">{children}</span>
    </LxButtonRoot>
);

export { LxButton };
