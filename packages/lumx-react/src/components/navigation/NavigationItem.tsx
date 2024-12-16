import React, { ElementType, ReactNode } from 'react';
import { Icon, Placement, Size, Tooltip, Text } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { ComponentRef, HasClassName, HasPolymorphicAs, HasTheme } from '@lumx/react/utils/type';
import classNames from 'classnames';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { useOverflowTooltipLabel } from '@lumx/react/hooks/useOverflowTooltipLabel';

type BaseNavigationItemProps = {
    /** Icon (SVG path). */
    icon?: string;
    /** Label content. */
    label: ReactNode;
    /** Mark as the current page link */
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

export const NavigationItem = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = 'a'>(props: NavigationItemProps<E>, ref: ComponentRef<E>) => {
        const { className, icon, label, isCurrentPage, as: Element = 'a', ...forwardedProps } = props;
        const theme = useTheme();
        const { tooltipLabel, labelRef } = useOverflowTooltipLabel();

        const buttonProps = Element === 'button' ? { type: 'button' } : {};

        return (
            <li
                className={classNames(
                    className,
                    handleBasicClasses({
                        prefix: CLASSNAME,
                        theme,
                    }),
                )}
            >
                <Tooltip label={tooltipLabel} placement={Placement.TOP}>
                    <Element
                        className={handleBasicClasses({
                            prefix: `${CLASSNAME}__link`,
                            isSelected: isCurrentPage,
                        })}
                        ref={ref as React.Ref<any>}
                        aria-current={isCurrentPage ? 'page' : undefined}
                        {...buttonProps}
                        {...forwardedProps}
                    >
                        {icon ? (
                            <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} theme={theme} />
                        ) : null}

                        <Text as="span" truncate className={`${CLASSNAME}__label`} ref={labelRef}>
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
