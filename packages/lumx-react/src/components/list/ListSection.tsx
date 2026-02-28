import { ReactNode } from 'react';

import { Icon, Text } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useId } from '@lumx/react/hooks/useId';

/**
 * Defines the props of the component.
 */
export interface ListSectionProps extends GenericProps {
    /** Section label displayed as the group title. */
    label?: ReactNode;
    /** Section icon */
    icon?: string;
    /** List items (should be ListItem, ListDivider, etc.). */
    children: ReactNode;
    /** Items wrapper forwarded props */
    itemsWrapperProps?: React.ComponentProps<'ul'>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ListSection';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list-section';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * ListSection component.
 */
export const ListSection = forwardRef<ListSectionProps, HTMLLIElement>((props, ref) => {
    const { children, className, label, icon, itemsWrapperProps, ...forwardedProps } = props;
    const labelId = useId();

    return (
        <li ref={ref} {...forwardedProps} className={classNames.join(className, block())}>
            {label && (
                <Text as="p" typography="overline" className={element('title')} id={labelId}>
                    {icon && <Icon icon={icon} />}
                    {label}
                </Text>
            )}
            <ul {...itemsWrapperProps} className={element('items')} aria-labelledby={label ? labelId : undefined}>
                {children}
            </ul>
        </li>
    );
});
ListSection.displayName = COMPONENT_NAME;
ListSection.className = CLASSNAME;
