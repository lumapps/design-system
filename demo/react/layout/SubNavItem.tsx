import React from 'react';

import classNames from 'classnames';

import slugify from 'slugify';

interface IProps {
    activeComponent?: string;
    children: JSX.Element | string;
    component?: string;
    handleClick: (component: string) => void;
}

export const SubNavItem = ({ children, component, handleClick, activeComponent }: IProps): JSX.Element => {
    component = slugify(component || children.toString(), {
        lower: true,
    });

    const onClick: () => void = () => {
        handleClick(component!);
    };

    return (
        <a
            className={classNames('sub-nav__item', { 'sub-nav__item--is-active': activeComponent === component })}
            onClick={onClick}
        >
            {children}
        </a>
    );
};
