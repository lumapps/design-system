import React, { forwardRef, ReactNode, useState } from 'react';
import { Icon, Placement, Size, Theme, Tooltip, Text } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { NavigationItem } from '@lumx/react/components/navigation/NavigationItem';
import { Comp } from '@lumx/react/utils/type';
import classNames from 'classnames';
import { CLASSNAME as ITEM_CLASSNAME } from './NavigationItem';
import { ClassificationType } from 'typescript';

export interface NavigationButtonProps {
    /** Classname that will be used for the nav wrapping element */
    className?: string;
    /** the element used to create data attributes */
    element?: string;
    /** Icon (SVG path). */
    icon?: string;
    /** Whether the component is active or not. */
    isSelected?: boolean;
    /** Label content. */
    label: string | ReactNode;
    /** On click callback. */
    onClick?(evt: React.MouseEvent): void;
    /** Theme that will be applied to the element, either Theme.dark or Theme.light */
    theme?: Theme;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NavigationButton';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);
// ref ?
const NavigationButton: Comp<NavigationButtonProps, HTMLLIElement> = forwardRef((props, ref) => {
    const { className, element, icon, isSelected, label, onClick, theme, ...forwardedProps } = props;

    const [labelElement, setLabelElement] = useState<HTMLSpanElement | null>(null);

    const tooltipLabel =
        typeof label === 'string' && labelElement && labelElement.offsetWidth < labelElement.scrollWidth ? label : null;

    return (
        <NavigationItem className={classNames(CLASSNAME, className)} ref={ref} {...forwardedProps}>
            <Tooltip label={tooltipLabel} placement={Placement.TOP}>
                <button
                    type="button"
                    className={classNames(
                        handleBasicClasses({
                            prefix: `${ITEM_CLASSNAME}__link`,
                            isSelected,
                        }),
                    )}
                    onClick={onClick}
                    tabIndex={0}
                >
                    {icon ? (
                        <Icon className={`${ITEM_CLASSNAME}__icon`} icon={icon} size={Size.xs} theme={theme} />
                    ) : null}

                    <Text as="span" truncate className={`${ITEM_CLASSNAME}__label`} ref={setLabelElement}>
                        {label}
                    </Text>
                </button>
            </Tooltip>
        </NavigationItem>
    );
});

NavigationButton.displayName = COMPONENT_NAME;
NavigationButton.className = CLASSNAME;

export { NavigationButton };
