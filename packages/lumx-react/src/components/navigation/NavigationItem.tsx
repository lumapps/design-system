import { ElementType, ReactNode } from 'react';
import { Icon, Placement, Size, Text, Tooltip } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';
import { ComponentRef, HasClassName, HasPolymorphicAs, HasRequiredLinkHref, HasTheme } from '@lumx/react/utils/type';

import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { useOverflowTooltipLabel } from '@lumx/react/hooks/useOverflowTooltipLabel';
import { RawClickable } from '@lumx/react/utils/react/RawClickable';

import { ITEM_CLASSNAME as CLASSNAME, ITEM_COMPONENT_NAME as COMPONENT_NAME } from './constants';

const { block, element } = classNames.bem(CLASSNAME);

type BaseNavigationItemProps = {
    /** Icon (SVG path). */
    icon?: string;
    /** Label content. */
    label: ReactNode;
    /** Mark as the current page link */
    isCurrentPage?: boolean;
};

/**
 * Navigation item props
 */
export type NavigationItemProps<E extends ElementType = 'a'> = HasPolymorphicAs<E> &
    HasTheme &
    HasClassName &
    BaseNavigationItemProps &
    HasRequiredLinkHref<E>;

export const NavigationItem = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = 'a'>(props: NavigationItemProps<E>, ref: ComponentRef<E>) => {
        const { className, icon, label, isCurrentPage, as: Element = 'a', ...forwardedProps } = props;
        const theme = useTheme();
        const { tooltipLabel, labelRef } = useOverflowTooltipLabel(label);

        return (
            <li
                className={classNames.join(
                    className,
                    block({
                        [`theme-${theme}`]: Boolean(theme),
                    }),
                )}
            >
                <Tooltip label={tooltipLabel} placement={Placement.TOP}>
                    <RawClickable
                        as={Element}
                        className={element('link', {
                            'is-selected': isCurrentPage,
                        })}
                        ref={ref as React.Ref<any>}
                        aria-current={isCurrentPage ? 'page' : undefined}
                        {...forwardedProps}
                    >
                        {icon ? <Icon className={element('icon')} icon={icon} size={Size.xs} theme={theme} /> : null}

                        <Text as="span" truncate className={element('label')} ref={labelRef}>
                            {label}
                        </Text>
                    </RawClickable>
                </Tooltip>
            </li>
        );
    }),
    {
        displayName: COMPONENT_NAME,
        className: CLASSNAME,
    },
);
