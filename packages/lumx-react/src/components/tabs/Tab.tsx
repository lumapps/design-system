import React, { KeyboardEventHandler, MouseEventHandler, ReactNode, SyntheticEvent } from 'react';

import classNames from 'classnames';

import { Icon, IconProps, Size } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX, ENTER_KEY_CODE } from '@lumx/react/constants';
import { GenericProps, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface TabProps extends GenericProps {
    /** Tab index */
    index?: number;
    /** Tab icon */
    icon?: IconProps['icon'];
    /** Is tab active */
    isActive?: boolean;
    /** Is tab disabled */
    isDisabled?: boolean;
    /** Tab label */
    label?: string | ReactNode;
    /** Function to trigger on tab click */
    onTabClick?(e: { event: SyntheticEvent; index?: number }): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Tab`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = `${CSS_PREFIX}-tabs__link`;

/**
 * Define a single Tab for Tabs component.
 *
 * @return The component.
 */
const Tab: React.FC<TabProps> = ({
    className,
    icon,
    index,
    isActive,
    disabled,
    isDisabled = disabled,
    label,
    onTabClick,
    ...forwardedProps
}) => {
    const handleTabClick: MouseEventHandler = (event) => {
        onTabClick?.({ event, index });
    };

    const handleKeyPress: KeyboardEventHandler = (event) => {
        const keyCode = event.which ?? event.keyCode;

        if (keyCode !== ENTER_KEY_CODE) {
            return;
        }

        onTabClick?.({ event, index });
    };

    return (
        <a
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isActive, isDisabled }))}
            tabIndex={isDisabled ? -1 : 0}
            onClick={handleTabClick}
            onKeyPress={handleKeyPress}
            aria-disabled={isDisabled}
        >
            {icon && <Icon icon={icon} size={Size.xs} />}
            {label && <span>{label}</span>}
        </a>
    );
};
Tab.displayName = COMPONENT_NAME;

export { CLASSNAME, Tab, TabProps };
