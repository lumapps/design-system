import React, { ElementType, forwardRef, ReactNode, useState } from 'react';
import { Icon, Placement, Size, Theme, Tooltip, Text, Link } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { NavigationItem } from '@lumx/react/components/navigation/NavigationItem';
import { Comp } from '@lumx/react/utils/type';
import classNames from 'classnames';
import { CLASSNAME as ITEM_CLASSNAME } from './NavigationItem';

export interface NavigationLinkProps {
    /** Classname that will be used for the nav wrapping element */
    className?: string;
    /** the element used to create data attributes */
    element?: Element;
    /* Icon (SVG path). */
    icon?: string;
    /** Label content. */
    label: ReactNode;
    /** Whether the component is active or not. */
    isSelected?: boolean;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | ElementType;
    /** Props to pass to the link (minus those already set by the NavigationLink props). */
    linkProps?:
        | React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
        | React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
        | Record<string, any>;
    /** Theme that will be applied to the element, either Theme.dark or Theme.light */
    theme?: Theme;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NavigationLink';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const NavigationLink: Comp<NavigationLinkProps, HTMLLIElement> = forwardRef((props, ref) => {
    const { className, element, icon, label, linkAs, linkProps, theme, isSelected, ...forwardedProps } = props;

    const [labelElement, setLabelElement] = useState<HTMLSpanElement | null>(null);
    const tooltipLabel =
        typeof label === 'string' && labelElement && labelElement.offsetWidth < labelElement.scrollWidth ? label : null;

    const Element: 'a' | ElementType = linkAs || 'a';

    return (
        <NavigationItem className={className} ref={ref} {...forwardedProps}>
            <Tooltip label={tooltipLabel} placement={Placement.TOP}>
                <Element
                    className={classNames(
                        CLASSNAME, className,
                        handleBasicClasses({
                            prefix: `${ITEM_CLASSNAME}__link`,
                            isSelected,
                        }),
                    )}
                    {...linkProps}
                    tabIndex={0}
                    ref={ref} {...forwardedProps}
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
});

NavigationLink.displayName = COMPONENT_NAME;
NavigationLink.className = CLASSNAME;

export { NavigationLink };
