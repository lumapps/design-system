import React, { Children, cloneElement } from 'react';

import classNames from 'classnames';

import '../style/lx-button.scss';

import { ILxButtonProps, LxButton } from './LxButton';

export const LxIconButton: React.FC<ILxButtonProps> = ({ children, ...props }) => (
    <LxButton className="lx-button--shape-circled" {...props}>
        {Children.map(children, (child: any) =>
            cloneElement(child, {
                className: classNames(child.props.className, 'lx-button__icon'),
            }),
        )}
    </LxButton>
);
