import React, { forwardRef, ReactNode, useRef, useState, useMemo, useContext } from 'react';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';
import { Icon, Size, Theme, Text, Orientation, Popover, Placement } from '@lumx/react';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Comp } from '@lumx/react/utils/type';
import { CLASSNAME as ITEM_CLASSNAME } from './NavigationItem';
import { NavigationContext } from './context';

export interface NavigationSectionProps {
    /** Classname that will be used for the nav wrapping element */
    className?: string;
    /** Items inside the section */
    children: ReactNode;
    /** Icon (SVG path). */
    icon?: string;
    /** Label content. */
    label: string | ReactNode;
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
    const { children, className, label, icon, ...forwardedProps } = props;
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const sectionId = useMemo(() => uniqueId('section'), []);
    const { orientation } = useContext(NavigationContext) || {};
    const isDropdown = orientation === Orientation.horizontal;
    return (
        <li
            className={classNames(
                className,
                ITEM_CLASSNAME,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            ref={ref}
            {...forwardedProps}
        >
            <button
                aria-controls={sectionId}
                aria-expanded={isOpen}
                className={classNames(`${ITEM_CLASSNAME}__link`)}
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
                {icon ? <Icon className={`${ITEM_CLASSNAME}__icon`} icon={icon} size={Size.xs} /> : null}

                <Text as="span" truncate className={`${ITEM_CLASSNAME}__label`} ref={ref}>
                    {label}
                </Text>
                <Icon
                    className={classNames(`${ITEM_CLASSNAME}__icon`, `${CLASSNAME}__chevron`)}
                    icon={isOpen ? mdiChevronUp : mdiChevronDown}
                />
            </button>
            {isOpen &&
                (isDropdown ? (
                    <Popover
                        anchorRef={buttonRef}
                        isOpen={isOpen}
                        placement={Placement.BOTTOM_START}
                        usePortal={false}
                        closeOnClickAway
                        closeOnEscape
                        onClick={() => setIsOpen(false)}
                        onClose={() => setIsOpen(false)}
                        onKeyUp={(event: React.KeyboardEvent) => {
                            if (event.key === 'Enter') {
                                setIsOpen(false);
                            }
                        }}
                        zIndex={996}
                        theme={Theme.light}
                    >
                        <ul className={`${CLASSNAME}__drawer--popover`} id={sectionId}>
                            <NavigationContext.Provider value={{ orientation: Orientation.vertical }}>
                                {children}
                            </NavigationContext.Provider>
                        </ul>
                    </Popover>
                ) : (
                    <ul className={`${CLASSNAME}__drawer`} id={sectionId}>
                        {children}
                    </ul>
                ))}
        </li>
    );
});

NavigationSection.displayName = COMPONENT_NAME;
NavigationSection.className = CLASSNAME;

export { NavigationSection };
