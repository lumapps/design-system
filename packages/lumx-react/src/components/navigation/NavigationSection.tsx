import { useRef, useState, useContext } from 'react';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';
import { Icon, Size, Text, Orientation, Popover, Placement, Theme } from '@lumx/react';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
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
    const item = useClassnames(ITEM_CLASSNAME);
    const { block, element } = useClassnames(CLASSNAME);

    return (
        <li
            className={block([
                className,
                item.block({
                    [`theme-${theme}`]: Boolean(theme),
                }),
            ])}
            ref={ref}
        >
            <RawClickable<'button'>
                as="button"
                {...forwardedProps}
                aria-controls={sectionId}
                aria-expanded={isOpen}
                className={item.element('link')}
                ref={buttonRef}
                onClick={(event) => {
                    setIsOpen(!isOpen);
                    event.stopPropagation();
                }}
            >
                {icon ? <Icon className={item.element('icon')} icon={icon} size={Size.xs} /> : null}

                <Text as="span" truncate className={item.element('label')} ref={ref}>
                    {label}
                </Text>
                <Icon
                    className={element('chevron', [item.element('icon')])}
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
                            <ul className={element('drawer', { popover: true })} id={sectionId}>
                                <NavigationContext.Provider value={{ orientation: Orientation.vertical }}>
                                    {children}
                                </NavigationContext.Provider>
                            </ul>
                        </ThemeProvider>
                    </Popover>
                ) : (
                    <ul className={element('drawer')} id={sectionId}>
                        {children}
                    </ul>
                ))}
        </li>
    );
});
NavigationSection.displayName = COMPONENT_NAME;
NavigationSection.className = CLASSNAME;
