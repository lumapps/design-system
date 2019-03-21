import React from 'react';

import classNames from 'classnames';
import slugify from 'slugify';

import isEmpty from 'lodash/isEmpty';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps {
    /**
     * The active component.
     * If the active component is the same as the one of the current sub navigation item, then highlight it.
     */
    activeComponent?: string;

    /**
     * The label of the sub navigation item.
     */
    children: JSX.Element | string;

    /**
     * The name of the component this sub navigation item will activate when clicked.
     * If no name is given, then the name will be computed from the label of the sub navigation item. The label will be
     * slugified (i.e. lowercased and all special character and spaces replaced by a '-').
     */
    component?: string;

    /**
     * The function to handle the click on a sub navigation item.
     * This function will activate the component corresponding to the current sub navigation item
     */
    handleClick(component: string): void;
}

/////////////////////////////

/**
 * The sub navigation item component.
 * This component will display a link with the name of the component it will activate upon click.
 * It will also highlight if it's component matche the activated one.
 *
 * @return {JSX.Element} The sub navigation item component.
 */
const SubNavItem: React.FC<IProps> = ({ children, component, handleClick, activeComponent }: IProps): JSX.Element => {
    component = slugify(component || children.toString(), {
        lower: true,
    });

    const onClick: () => void = (): void => {
        if (component !== undefined && !isEmpty(component)) {
            handleClick(component);
        }
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

/////////////////////////////

export { SubNavItem };
