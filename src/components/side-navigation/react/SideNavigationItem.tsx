import React, { Children, ReactElement, ReactNode } from 'react';

import { Icon, Size } from 'LumX';
import { Emphasis } from 'LumX/components/index';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';
import { mdiChevronDown, mdiChevronUp } from 'LumX/icons';
import { COMPONENT_PREFIX } from 'LumX/react/constants';
import { Callback, IGenericProps, getRootClassName, isComponent } from 'LumX/react/utils';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

/**
 * Defines the props of the component.
 */
interface ISideNavigationItemProps extends IGenericProps {
    /** Side navigation item content (should use `<SideNavigationItem>`). */
    children?: ReactNode;

    /** Menu item emphasis. */
    emphasis?: Emphasis;

    /** Menu item label. */
    label: string;

    /** Menu item icon (SVG path code). */
    icon?: string;

    /** Whether or not the menu is open. */
    isOpen?: boolean;

    /** Whether or not the menu is selected. */
    isSelected?: boolean;

    /** On click handler. */
    onClick?(evt: React.MouseEvent): void;
}
type SideNavigationItemProps = ISideNavigationItemProps;

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SideNavigationItem`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<SideNavigationItemProps> = {
    emphasis: Emphasis.high,
    isOpen: false,
    isSelected: false,
};

const SideNavigationItem: React.FC<ISideNavigationItemProps> = (props: ISideNavigationItemProps): ReactElement => {
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
                tabIndex={0}
                onClick={onClick}
                onKeyDown={onClick ? onEnterPressed(onClick as Callback) : undefined}
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

export { CLASSNAME, DEFAULT_PROPS, SideNavigationItem, SideNavigationItemProps };
