import React, { Children, ReactNode } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import { Emphasis, Icon, Size } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import {
    Callback,
    GenericProps,
    getRootClassName,
    handleBasicClasses,
    isComponent,
    onEnterPressed,
} from '@lumx/react/utils';
import { IconButton } from '../button/IconButton';

/**
 * Defines the props of the component.
 */
interface SideNavigationItemProps extends GenericProps {
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

    /** props that will be passed on to the Link */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

    /** the level of the elem */
    level?: number;

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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<SideNavigationItemProps> = {
    emphasis: Emphasis.high,
    isOpen: false,
    isSelected: false,
    level: 1,
};

const SideNavigationItem: React.FC<SideNavigationItemProps> = (props) => {
    const {
        children,
        className,
        emphasis = DEFAULT_PROPS.emphasis,
        label,
        icon,
        isOpen = DEFAULT_PROPS.isOpen,
        isSelected = DEFAULT_PROPS.isSelected,
        onClick,
        linkProps,
        level = DEFAULT_PROPS.level,
        ...forwardedProps
    } = props;

    const content = children && Children.toArray(children).filter(isComponent(SideNavigationItem));
    const hasContent = !isEmpty(content);
    const shouldSplitActions = Boolean(linkProps && onClick);

    return (
        <li
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    emphasis,
                    level,
                    isOpen,
                    isSelected,
                    prefix: CLASSNAME,
                }),
            )}
        >
            {shouldSplitActions ? (
                <div className={`${CLASSNAME}__wrapper`}>
                    <a
                        {...(linkProps || {})}
                        className={classNames(
                            handleBasicClasses({
                                level,
                                noicon: !Boolean(icon),
                                prefix: `${CLASSNAME}__link`,
                            }),
                        )}
                        tabIndex={0}
                    >
                        {icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} />}
                        <span>{label}</span>
                    </a>

                    <IconButton
                        className={`${CLASSNAME}__chevron`}
                        icon={isOpen ? mdiChevronUp : mdiChevronDown}
                        size={Size.m}
                        emphasis={Emphasis.low}
                        onClick={onClick}
                        isRounded
                    />
                </div>
            ) : (
                <a
                    {...(linkProps || {})}
                    className={`${CLASSNAME}__link ${CLASSNAME}__link--level-${level}`}
                    tabIndex={0}
                    onClick={onClick}
                    onKeyDown={onClick ? onEnterPressed(onClick as Callback) : undefined}
                >
                    {icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} />}
                    <span>{label}</span>
                    {hasContent && (
                        <Icon
                            className={`${CLASSNAME}__chevron`}
                            icon={isOpen ? mdiChevronUp : mdiChevronDown}
                            size={Size.s}
                        />
                    )}
                </a>
            )}

            {hasContent && isOpen && <ul className={`${CLASSNAME}__children`}>{content}</ul>}
        </li>
    );
};
SideNavigationItem.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, SideNavigationItem, SideNavigationItemProps };
