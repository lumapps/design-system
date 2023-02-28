import React, { forwardRef, ReactNode, useRef, useState, useMemo } from 'react';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';
import { Icon, Size, Theme, Text } from '@lumx/react';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Comp } from '@lumx/react/utils/type';
import { CLASSNAME as ITEM_CLASSNAME } from './NavigationItem';

export interface NavigationSectionProps {
    /** Classname that will be used for the nav wrapping element */
    className?: string;
    /** Items inside the section */
    children: ReactNode;
    /** the element used to create data attributes */
    element?: string;
    /** Icon (SVG path). */
    icon?: string;
    /** Label content. */
    label: string | ReactNode;
    /** Theme that will be applied to the element, either Theme.dark or Theme.light */
    theme?: Theme;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NavigationSection';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const NavigationSection: Comp<NavigationSectionProps, HTMLLIElement> = forwardRef((props, ref) => {
    const { children, className, element, label, theme, icon, ...forwardedProps } = props;
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const sectionId = useMemo(() => uniqueId('section'), []);
    return (
        <li
            className={classNames(
                className,
                ITEM_CLASSNAME,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
            ref={ref}
            {...forwardedProps}
        >
            <button
                aria-controls={sectionId}
                aria-expanded={isOpen}
                className={classNames(`${ITEM_CLASSNAME}__link`, {
                    [`${ITEM_CLASSNAME}__link--dark`]: theme === Theme.dark,
                })}
                ref={buttonRef}
                onClick={(event) => {
                    setIsOpen(!isOpen);
                    event.stopPropagation();
                }}
                onKeyUp={(event: React.KeyboardEvent) => {
                    if (event.key === 'Enter') {
                        event.stopPropagation();
                    }
                }}
                type="button"
            >
                {icon ? <Icon className={`${ITEM_CLASSNAME}__icon`} icon={icon} size={Size.xs} theme={theme} /> : null}

                <Text as="span" truncate className={`${ITEM_CLASSNAME}__label`} ref={ref}>
                    {label}
                </Text>
                <Icon
                    className={classNames(`${ITEM_CLASSNAME}__icon`, `${CLASSNAME}__chevron`)}
                    icon={isOpen ? mdiChevronUp : mdiChevronDown}
                    theme={theme}
                />
            </button>
            {isOpen && (
                <ul className={`${CLASSNAME}__drawer`} id={sectionId}>
                    {children}
                </ul>
            )}
        </li>
    );
});

NavigationSection.displayName = 'NavigationSection';
NavigationSection.className = CLASSNAME;

export { NavigationSection };
