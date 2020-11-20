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
import { renderLink } from '@lumx/react/utils/renderLink';

import { IconButton } from '../button/IconButton';

/**
 * Defines the props of the component.
 */
interface SideNavigationItemProps extends GenericProps {
    /** The children elements. Should use SideNavigationItem. */
    children?: ReactNode;
    /** The emphasis variant of the component. */
    emphasis?: Emphasis;
    /** The label of the menu item. */
    label: string | ReactNode;
    /** The icon the menu item (SVG path code). */
    icon?: string;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Sets a custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** The props to pass to the link, minus those already set by the SideNavigationItem props. */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** The function called on click on the action button. */
    onActionClick?(evt: React.MouseEvent): void;
    /** The function called on click on the component. */
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
};

const SideNavigationItem: React.FC<SideNavigationItemProps> = (props) => {
    const {
        children,
        className,
        emphasis,
        icon,
        isOpen,
        isSelected,
        label,
        linkAs,
        linkProps,
        onActionClick,
        onClick,
        ...forwardedProps
    } = props;

    const content = children && Children.toArray(children).filter(isComponent(SideNavigationItem));
    const hasContent = !isEmpty(content);
    const shouldSplitActions = Boolean(onActionClick);

    return (
        <li
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    emphasis,
                    isOpen,
                    isSelected,
                    prefix: CLASSNAME,
                }),
            )}
        >
            {shouldSplitActions ? (
                <div className={`${CLASSNAME}__wrapper`}>
                    {renderLink(
                        {
                            linkAs,
                            ...linkProps,
                            className: `${CLASSNAME}__link`,
                            onClick,
                            tabIndex: 0,
                        },
                        icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} />,
                        <span>{label}</span>,
                    )}

                    <IconButton
                        className={`${CLASSNAME}__toggle`}
                        icon={isOpen ? mdiChevronUp : mdiChevronDown}
                        size={Size.m}
                        emphasis={Emphasis.low}
                        onClick={onActionClick}
                    />
                </div>
            ) : (
                renderLink(
                    {
                        linkAs,
                        ...linkProps,
                        className: `${CLASSNAME}__link`,
                        tabIndex: 0,
                        onClick,
                        onKeyDown: onClick ? onEnterPressed(onClick as Callback) : undefined,
                    },
                    icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} />,
                    <span>{label}</span>,
                    hasContent && (
                        <Icon
                            className={`${CLASSNAME}__chevron`}
                            icon={isOpen ? mdiChevronUp : mdiChevronDown}
                            size={Size.xs}
                        />
                    ),
                )
            )}

            {hasContent && isOpen && <ul className={`${CLASSNAME}__children`}>{content}</ul>}
        </li>
    );
};
SideNavigationItem.displayName = COMPONENT_NAME;
SideNavigationItem.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, SideNavigationItem, SideNavigationItemProps };
