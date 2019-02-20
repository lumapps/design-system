import React, { Children, cloneElement } from 'react';
import classNames from 'classnames';

import { LxButton } from './LxButton';
import '../style/lx-button.scss';

export const LxIconButton = ({ children, ...props }) => (
    <LxButton className="lx-button--shape-circled" {...props}>
        {Children.map(children, (child) =>
            cloneElement({
                ...child,
                props: {
                    ...child.props,
                    className: classNames(child.props.className, 'lx-button__icon'),
                },
            }),
        )}
    </LxButton>
);
