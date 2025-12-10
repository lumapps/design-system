import { useRef, useState, useContext } from 'react';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';
import { Icon, Size, Text, Orientation, Popover, Placement, Theme } from '@lumx/react';
import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { HasClassName } from '@lumx/react/utils/type';
import { ThemeProvider, useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { RawClickable } from '@lumx/react/utils/react/RawClickable';

import { NavigationContext } from './context';
import { ITEM_CLASSNAME } from './constants';

export interface NavigationSectionProps extends React.ComponentPropsWithoutRef<'button'>, HasClassName {
    /** Items inside the section */
    children: React.ReactNode;
    /** Icon (SVG path). */
    icon?: string;
    /** Label content. */
    label: string | React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NavigationSection';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-navigation-section';

export const NavigationSection = forwardRef<NavigationSectionProps, HTMLLIElement>((props, ref) => {
    const { children, className, label, icon, ...forwardedProps } = props;
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const sectionId = useId();
    const { orientation } = useContext(NavigationContext) || {};
    const theme = useTheme();
    const isDropdown = orientation === Orientation.horizontal;
    return (
        <li
            className={classNames.join(
                className,
                CLASSNAME,
                ITEM_CLASSNAME,
                handleBasicClasses({
                    prefix: ITEM_CLASSNAME,
                    theme,
                }),
            )}
            ref={ref}
        >
            <RawClickable<'button'>
                as="button"
                {...forwardedProps}
                aria-controls={sectionId}
                aria-expanded={isOpen}
                className={classNames.join(`${ITEM_CLASSNAME}__link`)}
                ref={buttonRef}
                onClick={(event) => {
                    setIsOpen(!isOpen);
                    event.stopPropagation();
                }}
            >
                {icon ? <Icon className={`${ITEM_CLASSNAME}__icon`} icon={icon} size={Size.xs} /> : null}

                <Text as="span" truncate className={`${ITEM_CLASSNAME}__label`} ref={ref}>
                    {label}
                </Text>
                <Icon
                    className={classNames.join(`${ITEM_CLASSNAME}__icon`, `${CLASSNAME}__chevron`)}
                    icon={isOpen ? mdiChevronUp : mdiChevronDown}
                />
            </RawClickable>
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
                        <ThemeProvider value={Theme.light}>
                            <ul className={`${CLASSNAME}__drawer--popover`} id={sectionId}>
                                <NavigationContext.Provider value={{ orientation: Orientation.vertical }}>
                                    {children}
                                </NavigationContext.Provider>
                            </ul>
                        </ThemeProvider>
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
