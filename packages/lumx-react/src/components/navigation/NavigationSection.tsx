import React, { forwardRef, ReactNode, useRef, useState, useContext } from 'react';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';
import { Icon, Size, Text, Orientation, Popover, Placement, Theme } from '@lumx/react';
import classNames from 'classnames';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { HasClassName } from '@lumx/react/utils/type';
import { ThemeContext } from '@lumx/react/utils/ThemeContext';
import { useId } from '@lumx/react/hooks/useId';

import { CLASSNAME as ITEM_CLASSNAME } from './NavigationItem';
import { NavigationContext } from './context';

export interface NavigationSectionProps extends React.ComponentPropsWithoutRef<'li'>, HasClassName {
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

export const NavigationSection = Object.assign(
    forwardRef<HTMLLIElement, NavigationSectionProps>((props, ref) => {
        const { children, className, label, icon, ...forwardedProps } = props;
        const [isOpen, setIsOpen] = useState(false);
        const buttonRef = useRef<HTMLButtonElement>(null);
        const sectionId = useId();
        const { orientation } = useContext(NavigationContext) || {};
        const theme = useContext(ThemeContext);
        const isDropdown = orientation === Orientation.horizontal;
        return (
            <li
                className={classNames(
                    className,
                    CLASSNAME,
                    ITEM_CLASSNAME,
                    handleBasicClasses({
                        prefix: ITEM_CLASSNAME,
                        theme,
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
                            zIndex={996}
                        >
                            <ThemeContext.Provider value={Theme.light}>
                                <ul className={`${CLASSNAME}__drawer--popover`} id={sectionId}>
                                    <NavigationContext.Provider value={{ orientation: Orientation.vertical }}>
                                        {children}
                                    </NavigationContext.Provider>
                                </ul>
                            </ThemeContext.Provider>
                        </Popover>
                    ) : (
                        <ul className={`${CLASSNAME}__drawer`} id={sectionId}>
                            {children}
                        </ul>
                    ))}
            </li>
        );
    }),
    {
        displayName: COMPONENT_NAME,
        className: CLASSNAME,
    },
);
