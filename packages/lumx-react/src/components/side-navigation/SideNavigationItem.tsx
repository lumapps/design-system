import React, { Children, forwardRef, ReactNode } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';

import { Emphasis, Icon, Size, IconButton, IconButtonProps } from '@lumx/react';

import {
    Callback,
    Comp,
    GenericProps,
    getRootClassName,
    handleBasicClasses,
    isComponent,
    onEnterPressed,
} from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

/**
 * Defines the props of the component.
 */
export interface SideNavigationItemProps extends GenericProps {
    /** SideNavigationItem elements. */
    children?: ReactNode;
    /** Emphasis variant. */
    emphasis?: Emphasis;
    /** Label content. */
    label: string | ReactNode;
    /** Icon (SVG path). */
    icon?: string;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Props to pass to the link (minus those already set by the SideNavigationItem props). */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Props to pass to the toggle button (minus those already set by the SideNavigationItem props). */
    toggleButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color' | 'size'>;
    /** On action button click callback. */
    onActionClick?(evt: React.MouseEvent): void;
    /** On click callback. */
    onClick?(evt: React.MouseEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SideNavigationItem';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SideNavigationItemProps> = {
    emphasis: Emphasis.high,
};

/**
 * SideNavigationItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SideNavigationItem: Comp<SideNavigationItemProps, HTMLLIElement> = forwardRef((props, ref) => {
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
        toggleButtonProps,
        ...forwardedProps
    } = props;

    const content = children && Children.toArray(children).filter(isComponent(SideNavigationItem));
    const hasContent = !isEmpty(content);
    const shouldSplitActions = Boolean(onActionClick);

    return (
        <li
            ref={ref}
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
                        {...toggleButtonProps}
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
});
SideNavigationItem.displayName = COMPONENT_NAME;
SideNavigationItem.className = CLASSNAME;
SideNavigationItem.defaultProps = DEFAULT_PROPS;
