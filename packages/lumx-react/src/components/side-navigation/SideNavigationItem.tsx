import React, { Children, ReactNode } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import { Emphasis, Icon, Size } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent, onEnterPressed } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SideNavigationItemProps extends GenericProps {
    /** Side navigation item content (should use `<SideNavigationItem>`). */
    children?: ReactNode;

    /** Menu item emphasis. */
    emphasis?: Emphasis;

    /** Menu item label. */
    label: string | ReactNode;

    /** Menu item icon (SVG path code). */
    icon?: string;

    /** Whether or not the menu is open. */
    isOpen?: boolean;

    /** Whether or not the menu is selected. */
    isSelected?: boolean;

    /** On click handler. */
    onClick?(evt: React.MouseEvent): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SideNavigationItem`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<SideNavigationItemProps> = {
    emphasis: Emphasis.high,
    isOpen: false,
    isSelected: false,
};

export const SideNavigationItem: React.FC<SideNavigationItemProps> = (props) => {
    const {
        children,
        className,
        emphasis = DEFAULT_PROPS.emphasis,
        label,
        icon,
        isOpen = DEFAULT_PROPS.isOpen,
        isSelected = DEFAULT_PROPS.isSelected,
        onClick,
        ...otherProps
    } = props;

    const content = children && Children.toArray(children).filter(isComponent(SideNavigationItem));
    return (
        <li
            className={classNames(
                className,
                handleBasicClasses({
                    emphasis,
                    isOpen,
                    isSelected,
                    prefix: CLASSNAME,
                }),
            )}
            {...otherProps}
        >
            <a
                className={`${CLASSNAME}__link`}
                role="menuitem"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={onClick ? onEnterPressed(onClick as VoidFunction) : undefined}
            >
                {icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} />}
                <span>{label}</span>
                {!isEmpty(content) && (
                    <Icon
                        className={`${CLASSNAME}__chevron`}
                        icon={isOpen ? mdiChevronUp : mdiChevronDown}
                        size={Size.xs}
                    />
                )}
            </a>

            {!isEmpty(content) && isOpen && <ul className={`${CLASSNAME}__children`}>{content}</ul>}
        </li>
    );
};
SideNavigationItem.displayName = COMPONENT_NAME;
