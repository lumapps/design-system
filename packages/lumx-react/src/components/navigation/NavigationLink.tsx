import React, { ElementType, ReactNode, useState } from 'react';
import { Icon, Placement, Size, Text, Tooltip } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { NavigationItem } from '@lumx/react/components/navigation/NavigationItem';
import classNames from 'classnames';
import { ComponentRef, HasClassName, HasTheme } from '@lumx/react/utils/type';
import { forwardRefPolymorphic } from '@lumx/react/utils/forwardRefPolymorphic';
import { CLASSNAME as ITEM_CLASSNAME } from './NavigationItem';

export type NavigationLinkProps<E extends ElementType> = React.ComponentPropsWithoutRef<E> &
    HasTheme &
    HasClassName & {
        /** Icon (SVG path). */
        icon?: string;
        /** Label content. */
        label: ReactNode;
        /** Whether the component is active or not. */
        isCurrentPage?: boolean;
        /** Custom react component for the link (can be used to inject react router Link). */
        as?: E;
    };

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NavigationLink';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Navigation link component.
 */
export const NavigationLink = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = 'a'>(props: NavigationLinkProps<E>, ref: ComponentRef<E>) => {
        const { className, icon, label, as: Element = 'a', theme, isCurrentPage, ...forwardedProps } = props;

        const [labelElement, setLabelElement] = useState<HTMLSpanElement | null>(null);
        const tooltipLabel =
            typeof label === 'string' && labelElement && labelElement.offsetWidth < labelElement.scrollWidth
                ? label
                : null;

        return (
            <NavigationItem className={className}>
                <Tooltip label={tooltipLabel} placement={Placement.TOP}>
                    <Element
                        className={classNames(
                            CLASSNAME,
                            className,
                            handleBasicClasses({
                                prefix: `${ITEM_CLASSNAME}__link`,
                                isSelected: isCurrentPage,
                            }),
                        )}
                        tabIndex={0}
                        ref={ref}
                        aria-current={isCurrentPage ? 'page' : undefined}
                        {...forwardedProps}
                    >
                        {icon ? (
                            <Icon className={`${ITEM_CLASSNAME}__icon`} icon={icon} size={Size.xs} theme={theme} />
                        ) : null}

                        <Text as="span" truncate className={`${ITEM_CLASSNAME}__label`} ref={setLabelElement}>
                            {label}
                        </Text>
                    </Element>
                </Tooltip>
            </NavigationItem>
        );
    }),
    { displayName: COMPONENT_NAME, className: CLASSNAME },
);
