import { Icon, IconProps, Size } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX, ENTER_KEY_CODE } from '@lumx/react/constants';
import { GenericProps, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React, { FocusEventHandler, KeyboardEventHandler, ReactNode, useCallback } from 'react';
import { useTabProviderContext } from './state';

/**
 * Defines the props of the component.
 */
interface TabProps extends GenericProps {
    /** Children are not supported. */
    children?: never;
    /** The icon of the tab. */
    icon?: IconProps['icon'];
    /** The tab HTML id. */
    id?: string;
    /** Whether the tab is active or not. */
    isActive?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** The label of the tab. */
    label: string | ReactNode;
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
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TabProps> = {};

/**
 * Tab component.
 *
 * Implements WAI-ARIA `tab` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @return React element.
 */
const Tab: React.FC<TabProps> = (props) => {
    const {
        className,
        disabled,
        icon,
        id,
        isActive: propIsActive,
        isDisabled = disabled,
        label,
        onFocus,
        onKeyPress,
        tabIndex = -1,
        ...forwardedProps
    } = props;
    const state = useTabProviderContext('tab', id);
    const isActive = propIsActive || state.isActive;

    const changeToCurrentTab = useCallback(() => {
        if (isDisabled) {
            return;
        }
        state.changeToTab();
    }, [isDisabled, state.changeToTab]);

    const handleFocus: FocusEventHandler = useCallback(
        (event) => {
            onFocus?.(event);
            if (state.shouldActivateOnFocus) {
                changeToCurrentTab();
            }
        },
        [onFocus, state.shouldActivateOnFocus],
    );

    const handleKeyPress: KeyboardEventHandler = useCallback(
        (event) => {
            onKeyPress?.(event);
            const keyCode = event.which ?? event.keyCode;
            if (keyCode !== ENTER_KEY_CODE) {
                return;
            }
            changeToCurrentTab();
        },
        [onKeyPress],
    );

    return (
        <button
            {...forwardedProps}
            id={state.tabId}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isActive, isDisabled }))}
            onClick={changeToCurrentTab}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            role="tab"
            tabIndex={isActive ? 0 : tabIndex}
            aria-disabled={isDisabled}
            aria-selected={isActive}
            aria-controls={state.tabPanelId}
        >
            {icon && <Icon icon={icon} size={Size.xs} />}
            {label && <span>{label}</span>}
        </button>
    );
};
Tab.displayName = COMPONENT_NAME;
Tab.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Tab, TabProps };
