import React, { ElementType, ReactNode, useState } from 'react';
import { Icon, Placement, Size, Text, Tooltip } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { ComponentRef, HasClassName, HasPolymorphicAs, HasTheme } from '@lumx/react/utils/type';
import classNames from 'classnames';
import { forwardRefPolymorphic } from '@lumx/react/utils/forwardRefPolymorphic';

type BaseNavigationItemProps = {
    /**
     * Icon (SVG path).
     */
    icon?: string;
    /**
     * Navigation item label.
     */
    label: ReactNode;
    /**
     * Mark current item as the link to the current page.
     * Sets `aria-current=page` and applies a differentiating style.
     */
    isCurrentPage?: boolean;
};

/** Make `href` required when `as` is `a` */
type RequiredLinkHref<E> = E extends 'a' ? { href: string } : Record<string, unknown>;

/**
 * Navigation item props
 */
export type NavigationItemProps<E extends ElementType = 'a'> = HasPolymorphicAs<E> &
    HasTheme &
    HasClassName &
    BaseNavigationItemProps &
    RequiredLinkHref<E>;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NavigationItem';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Navigation item component
 */
export const NavigationItem = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = 'a'>(props: NavigationItemProps<E>, ref: ComponentRef<E>) => {
        const { className, icon, label, as: Element = 'a', theme, isCurrentPage, ...forwardedProps } = props;

        const [labelElement, setLabelElement] = useState<HTMLSpanElement | null>(null);
        const tooltipLabel =
            typeof label === 'string' && labelElement && labelElement.offsetWidth < labelElement.scrollWidth
                ? label
                : null;

        return (
            <li className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}>
                <Tooltip label={tooltipLabel} placement={Placement.TOP}>
                    <Element
                        className={handleBasicClasses({
                            prefix: `${CLASSNAME}__link`,
                            isSelected: isCurrentPage,
                        })}
                        ref={ref}
                        aria-current={isCurrentPage ? 'page' : undefined}
                        {...forwardedProps}
                    >
                        {icon ? (
                            <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} theme={theme} />
                        ) : null}

                        <Text as="span" truncate className={`${CLASSNAME}__label`} ref={setLabelElement}>
                            {label}
                        </Text>
                    </Element>
                </Tooltip>
            </li>
        );
    }),
    {
        displayName: COMPONENT_NAME,
        className: CLASSNAME,
    },
);
